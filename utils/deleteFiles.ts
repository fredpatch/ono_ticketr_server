import { utapi } from "../middlewares/uploadthing";

const deleteFileFromServer = async (fileKey: any) => {
  try {
    await utapi.deleteFiles([fileKey]);
    console.log(`File deleted successfully with key: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
};

export default deleteFileFromServer;
