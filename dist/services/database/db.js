"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../logs/logger");
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv config
dotenv_1.default.config();
// connect to database
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    let mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error("Mongo URI not found");
    }
    try {
        yield mongoose_1.default.connect(mongoURI, {
            autoIndex: true,
            // maxPoolSize: 50,
        });
        logger_1.logger.info("@@ MONGO Database Connected");
    }
    catch (error) {
        logger_1.logger.error(`@@ Connection error: ${error}`);
        throw error; // Re-throw the error after logging
    }
    mongoose_1.default.connection.on("error", (err) => {
        logger_1.logger.error(`@@ MongoDB connection error: ${err.message}`);
    });
    mongoose_1.default.connection.once("open", () => {
        logger_1.logger.info("@@ MongoDB connection opened");
    });
});
exports.default = dbConnect;
