import cache from "memory-cache";
import { logger } from "../services/logs/logger.js";

// Cache middleware function
export const cacheMiddleware = (duration) => (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`;
  const cachedData = cache.get(key);

  if (cachedData) {
    logger.info(`@@ Cache hit for ${req.originalUrl || req.url}`);
    return res.send(cachedData); // Send cached response
  }

  // Override res.send to cache data when it's first served
  logger.info(`@@ Cache miss for ${req.originalUrl || req.url}`);
  res.sendResponse = res.send;
  res.send = (body) => {
    logger.info(`@@ Caching ${req.originalUrl || req.url}`);
    cache.put(key, body, duration * 1500); // Cache duration in milliseconds
    res.sendResponse(body);
  };

  next();
};
