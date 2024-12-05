import cron from "node-cron";
import Token from "../models/Token.js";
import { logger } from "../services/logs/logger.js";

cron.schedule("0 0 * * *", async () => {
  try {
    logger.info("Cleaning up expired tokens...");
    const result = await Token.deleteMany({ expiresAt: { $lt: new Date() } });
    logger.info(`Deleted ${result.deletedCount} expired tokens.`);
    console.log(`Deleted ${result.deletedCount} expired tokens.`);
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
  }
});
