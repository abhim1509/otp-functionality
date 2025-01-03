import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../utility/redis_client.js";

// Configure the rate limiter
export const emailRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => {
      return redisClient.call(...args);
    },
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 100 requests per `windowMs`
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
