import { logger } from "../services/logs/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "Something went wrong in the app!" });
};
