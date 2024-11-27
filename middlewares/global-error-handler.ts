import { logger } from "../services/logs/logger";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong !" });
};
