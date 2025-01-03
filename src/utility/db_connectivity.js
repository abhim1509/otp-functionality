import mongoose from "mongoose";
import retry from "async-retry";

export const initializeDb = () => {
  // MongoDB connection string (local)
  const MONGO_URI = "mongodb://127.0.0.1:27017/my_database";

  return retry(
    async (bail) => {
      try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB!");
      } catch (error) {
        if (
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ENOTFOUND")
        ) {
          console.log("MongoDB connection refused. Retrying...");
          throw error;
        }
        bail(error);
      }
    },
    {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 8000,
      factor: 2, //exponential backoff
      randomize: true, //adding randomness to timeout
      onRetry: (error, attempt) => {
        console.log(`Retrying Attempt ${attempt} due to error:`, error);
      },
    }
  );
};
