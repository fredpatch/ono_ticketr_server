import { logger } from "../services/logs/logger.js";
import sendErrorResponse from "../middlewares/sendErrorResponse.js";
// import { ApiError } from "./../utils/errorClass.js";

// const errorHandler = (err, req, res, next) => {
//   logger.error(err.stack);
//   console.error(err);

//   const statusCode = err.statusCode || 500;
//   const errorMessage = err.message || "Internal Server Error";

//   res.status(statusCode).json({
//     success: false,
//     error: {
//       code: statusCode,
//       message: errorMessage,
//     },
//   });
// };

// export default errorHandler;

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error
  logger.info({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    query: req.query,
    params: req.params,
    body: req.body,
    statusCode,
  });

  // Respond with error details (avoid exposing stack in production)
  sendErrorResponse(res, statusCode, message, err.code || "INTERNAL_ERROR");
};

export default errorHandler;
