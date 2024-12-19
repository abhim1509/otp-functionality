import crypto from "crypto";

export const generateSecureOTP = () => {
  const buffer = crypto.randomBytes(3);
  const otp = buffer.readUIntBE(0, 3) % 1000000; // 6 digits
  return otp.toString().padStart(6, "0");
};
