import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { logger, requestLogger, errorLogger } from "../services/logs/logger";
import { httpLogger } from "../services/logs/httpLogger";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "../controllers/authController";
import verifyJWT from "../utils/verifyJWT";
import dbConnect from "../services/database/db";
import { RequestProps } from "../types/index";
import dataRouter from "../routes/routes";
import {
  errorHandler,
  limiter,
  rules,
  swaggerOptions,
} from "../middlewares/index";
import bodyParser from "body-parser";
import notificationRoute from "../routes/notificationRoute";

// init env
dotenv.config();
dbConnect();
const server = express();

// middlewares
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(httpLogger);
server.use(errorLogger);
// server.use(requestLogger);
// server.use(limiter);
server.use(helmet());
import "express-async-errors";

// server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// server.use(rules);

// global error handler
server.use(errorHandler);

// PORT
const PORT = process.env.PORT || 5000;

// Test route
// server.get("/", (req, res) => {
//   console.log("API is running...", req);
//   res.send("API is running...");
// });

// Example of a protected route
// server.get("/api/protected", verifyJWT, ({ req, res }: RequestProps) => {
//   res.send("This is a protected route");
// });

// routes
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1", dataRouter);
server.use("/api/v1/notifications", notificationRoute);

// Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

server.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// server start
server.listen(PORT, () => {
  logger.info(`@@ Server started on http://localhost:${PORT}`);
});

export default server;
