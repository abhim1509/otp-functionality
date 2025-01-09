import { generateSecureOTP } from "../utility/utilities.js";
import { Otp } from "../models/otp.model.js";

export const generateOTP = async (req, res) => {
  // Route to create a new otp
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newOtp = await Otp.findOneAndUpdate({
      email,
      otp: generateSecureOTP(),
    });

    res.status(201).json({ message: "OTP created successfully", user: newOtp });
  } catch (err) {
    res.status(500).json({ message: "Error creating OTP", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const validOtp = await Otp.find({
      email,
      otp,
      expiresAt: { $gte: new Date(new Date() - 30000) },
    });

    if (!validOtp || !validOtp.length) {
      return res.status(400).json({ message: "OTP not verified." });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
};
