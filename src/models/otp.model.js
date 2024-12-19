import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expiresAt: { type: Date, default: Date.now, expires: 30 }, //TTL index of 30 seconds.
});

export const Otp = mongoose.model("otp", OtpSchema);
