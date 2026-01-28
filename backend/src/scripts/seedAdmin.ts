import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.model";

async function run() {
  const MONGO_URI = process.env.MONGO_URI!;
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  const adminEmail = "admin@example.com";
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log("Admin already exists:", existing._id.toString());
    return process.exit(0);
  }

  const admin = await User.create({
    login: "admin",
    firstname: "User",
    lastname: "Admin",
    email: adminEmail,
    password: "Admin@123", // sera hashé par le pre('save')
    phone1: "000000000",
    address: "HQ",
    userType: "admin",
    sm: "m",
    isActive: true
  });

  console.log("Admin created:", admin._id.toString());
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
