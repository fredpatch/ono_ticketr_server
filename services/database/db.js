import mongoose from "mongoose";
import {logger}  from "../logs/logger.js";
import dotenv from "dotenv";
dotenv.config();

// connect to database
const dbConnect = async () => {
  let mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("Mongo URI not found");
  }

  logger.info(`@@ Connection to db ...`);
  try {
    let conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
      // maxPoolSize: 50,
    });

    logger.info(`@@ Database Connected::${conn.connection.db.databaseName}`);
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
