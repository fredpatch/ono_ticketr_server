import mongoose from "mongoose";
import { logger } from "../logs/logger.ts";
import dotenv from "dotenv";

// dotenv config
dotenv.config();

// connect to database
const dbConnect = async (): Promise<void> => {
  let mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("Mongo URI not found");
  }

  try {
    await mongoose.connect(mongoURI, {
      autoIndex: true,
      // maxPoolSize: 50,
    });

    logger.info("@@ MONGO Database Connected");
  } catch (error) {
    logger.error(`@@ Connection error: ${error}`);
    throw error; // Re-throw the error after logging
  }

  mongoose.connection.on("error", (err) => {
    logger.error(`@@ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.once("open", () => {
    logger.info("@@ MongoDB connection opened");
  });
};

export default dbConnect;
