import { generateSecureOTP } from "../utility/utilities.js";
import { Otp } from "../models/otp.model.js";

export const generateOTP = async (req, res) => {
  // Route to create a new user
  try {
    const { email } = req.body;
    const newOtp = await Otp.findOneAndUpdate({
      email,
      otp: generateSecureOTP(),
    });
    res.status(201).json({ message: "OTP created successfully", user: newOtp });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOtp = await Otp.find({
      email,
      otp,
      expiresAt: { $gte: new Date(new Date() - 30000) },
    });

    if (!validOtp || !validOtp.length) {
      return res.status(200).json({ message: "OTP not verified." });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};
