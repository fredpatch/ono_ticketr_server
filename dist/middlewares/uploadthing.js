"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = exports.utapi = void 0;
const express_1 = require("uploadthing/express");
const server_1 = require("uploadthing/server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.utapi = new server_1.UTApi();
// create uploadthing instance
const uploadthing = (0, express_1.createUploadthing)();
exports.uploadRouter = {
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
};
