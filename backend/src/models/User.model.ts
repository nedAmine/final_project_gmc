import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    login: string;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    phone1?: string;
    phone2?: string;
    password: string;
    address: string;
    userType: "admin" | "client";
    isActive: Boolean;
    sm: "m" | "g";
    // added methods 
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        login: {type: String, required: true, unique: true},
        firstname: {type: String},
        lastname: {type: String},
        name: {type: String},
        email: {type: String, unique: true},
        phone1: {type: String},
        phone2: {type: String},
        address: {type: String},
        password: {type: String},
        isActive: { type: Boolean, default: true },
        sm: {type: String, enum: ["m", "g"], default: "m"},
        userType: {type: String, enum: ["admin", "client"], default: "client"}
    },
    { timestamps: true }
);

//calculated field
userSchema.pre<IUser>("save", async function (next) {
    //build name
    const fullName = `${this.firstname ?? ""} ${this.lastname ?? ""}`.trim();
    this.name = !fullName ? this.login : fullName;
    //hash password
    if (this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default model<IUser>("User", userSchema);