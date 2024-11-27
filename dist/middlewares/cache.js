"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const memory_cache_1 = __importDefault(require("memory-cache"));
const logger_1 = require("../services/logs/logger");
// Cache middleware function
const cacheMiddleware = (duration) => (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedData = memory_cache_1.default.get(key);
    if (cachedData) {
        logger_1.logger.info(`@@ Cache hit for ${req.originalUrl || req.url}`);
        return res.send(cachedData); // Send cached response
    }
    // Override res.send to cache data when it's first served
    logger_1.logger.info(`@@ Cache miss for ${req.originalUrl || req.url}`);
    res.sendResponse = res.send;
    res.send = (body) => {
        logger_1.logger.info(`@@ Caching ${req.originalUrl || req.url}`);
        memory_cache_1.default.put(key, body, duration * 1500); // Cache duration in milliseconds
        res.sendResponse(body);
    };
    next();
};
exports.cacheMiddleware = cacheMiddleware;
