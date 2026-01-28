import { Schema, model, Document } from "mongoose";

export interface IVerification extends Document {
  email: string;
  code: string;           // 6-digit code as string
  expiresAt: Date;        // expiration timestamp
  createdAt: Date;        // auto by timestamps
}

const verificationSchema = new Schema<IVerification>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IVerification>("Verification", verificationSchema);
