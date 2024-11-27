import { createUploadthing, type FileRouter } from "uploadthing/express";
import { UTApi } from "uploadthing/server";
import dotenv from "dotenv";

dotenv.config();

export const utapi = new UTApi();
// create uploadthing instance
const uploadthing = createUploadthing();

export const uploadRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "4MB",
    },
  })
    .onUploadError((error) => console.log("Upload error:", error))
    .onUploadComplete((file) => {
      // file contains information about the uploaded file
      // NOTE: for files uploaded with a custom name, you can read it here:
      // file.uploadedFile.originalname
      console.log("Upload completed:", file);
    }),
} satisfies FileRouter;
