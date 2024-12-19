import { Router } from "express";
import { generateOTP, verifyOTP } from "./src/controllers/otp.controller.js";
import { emailRateLimiter } from "./src/middlewares/rate-limit.js";
const router = Router();

router.post("/otp", emailRateLimiter, generateOTP);
router.post("/otp-verify", verifyOTP);

export default router;
