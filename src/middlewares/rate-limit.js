import rateLimit from "express-rate-limit";

// Configure the rate limiter
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 100 requests per `windowMs`
  message: `Too many requests from this IP, please try again after 15 minutes.`,
  keyGenerator: (req) => req.body.email,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`Rate limit exceeded for user: ${req.body.email}`);
    res.status(429).json({
      message: "Too many requests from this email. Please try again later.",
    });
  },
});
