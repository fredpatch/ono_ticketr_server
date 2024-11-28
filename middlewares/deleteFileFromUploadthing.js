import { logger } from "../services/logs/logger.js";
import { UTApi } from "uploadthing/server";
// import { utapi } from "./uploadthing";
import dotenv from "dotenv";
dotenv.config();

export const utapi = new UTApi();
const deleteFileFromServer = async (fileKey) => {
  try {
    await utapi.deleteFiles(fileKey);
    logger.info(`File deleted successfully with key: ${fileKey}`);
    console.log(`File deleted successfully with key: ${fileKey}`);
  } catch (error) {
    logger.error("Error deleting file:", error);
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
};

export default deleteFileFromServer;
