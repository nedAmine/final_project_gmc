import { Request, response, Response } from "express";
import Verification from "../models/Verification.model";
import User from "../models/User.model";
import { sendVerificationEmail } from "../utils/mailer";
import { generateToken } from "../utils/generateToken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios"

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Step 1: request email verification code (unchanged)
export const requestRegister = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // **basic validation**
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    // **checking if user is already exist!**
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // **generate code + expiration (10 minutes)**
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // **Optional: deleting old codes for this email**
    await Verification.deleteMany({ email });

    // **Saving new code**
    await Verification.create({ email, code, expiresAt });

    // **sending email**
    if (Number(process.env.SMTP_PORT) > 0)
      await sendVerificationEmail(email, code);

    return res.status(200).json({ message: "Verification code sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

//Continue (manual login): verify by login OR email + password
export const continueManual = async (req: Request, res: Response) => {
  try {
    const { loginOrEmail, password } = req.body;
    
    if (!loginOrEmail || !password) {
      return res.status(400).json({ message: "login/email and password are required" });
    }

    const user = await User.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    });

    if (!user) {
      return res.status(401).json({ message: "login/email or password incorrect" });
    }

    //compare password
    const ok = await user.comparePassword(password);
    
    if (!ok) {
      return res.status(401).json({ message: "login/email or password incorrect" });
    }

    return res.status(200).json({
      token: generateToken(user._id.toString()),
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Manual continuation failed" });
  }
};

//Step 2: register after email verification (confirm code then create user)
export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      code,
      login,
      firstname,
      lastname,
      password,
      phone1,
      phone2,
      address
    } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const verification = await Verification.findOne({ email, code }).sort({ createdAt: -1 });
    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Ensure unique email/login
    const existingUser = await User.findOne({ $or: [{ email }, { login }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or login already exists" });
    }

    const user = await User.create({
      login,
      firstname,
      lastname,
      email,
      password,
      phone1,
      phone2,
      address,
      userType: "client", //by default = "client" so you can delete this line
      sm: "m" // manual "m" with email
    });

    await verification.deleteOne();

    return res.status(201).json({
      token: generateToken(user._id.toString()),
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Register failed" });
  }
};

//Continue with Google: verify token, find by google_id (login) or email, create if missing, then continue
/*export const continueWithGoogle = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    console.log("token" + token);

    if (!token) return res.status(400).json({ message: "Google token is required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    const { sub: google_id, email } = payload;
    if (!email) return res.status(400).json({ message: "Google email not available" });

    // Try by login (google_id) or email
    let user = await User.findOne({ $or: [{ login: google_id }, { email }] });

    if (!user) {
      user = await User.create({
        login: google_id,
        email,
        sm: "g",
        userType: "client",
        isActive: true
      });
    }

    return res.status(200).json({
      token: generateToken(user._id.toString()),
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Google continuation failed" });
  }
};
*/

export const continueWithGoogle = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) return res.status(400).json({ message: "Google token is required" });

    // checking access_token by called Google
    const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { sub: google_id, email, name } = profile;
    if (!email) return res.status(400).json({ message: "Google email not available" });

    let user = await User.findOne({ $or: [{ login: google_id }, { email }] });
    if (!user) {
      user = await User.create({
        login: google_id,
        firstname: name.split(' ')[0],
        lastname: name.split(' ')[1] ?? '',
        email,
        sm: "g",
        userType: "client",
        isActive: true
      });
    }

    return res.status(200).json({
      token: generateToken(user._id.toString()),
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Google continuation failed" }); }
};

// UPDATE User data
export const updateData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // getted from requireAuth
    const { firstname, lastname, phone1, phone2, address } = req.body;

    // checking valide fields
    const updateData: any = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (phone1 !== undefined) updateData.phone1 = phone1;
    if (phone2 !== undefined) updateData.phone2 = phone2;
    if (address !== undefined) updateData.address = address;

    // updating data
    const updatedData = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // return updated data
    );

    if (!updatedData) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user data" });
  }
};

// edit password
export const editPassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // getted from requireAuth
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await user.comparePassword(oldPassword);
    if (!ok) return res.status(401).json({ message: "Incorrect old password" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update password" });
  }
};