"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const compression_1 = __importDefault(require("compression"));
exports.rules = (0, compression_1.default)({
    threshold: 5024, // Only compress responses over 1KB
    level: 6, // Compression level (1-9)
});
