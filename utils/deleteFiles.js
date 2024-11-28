import { utapi } from "../middlewares/deleteFileFromUploadthing.js";

const deleteFileFromServer = async (fileKey) => {
  try {
    await utapi.deleteFiles([fileKey]);
    console.log(`File deleted successfully with key: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
};

export default deleteFileFromServer;
