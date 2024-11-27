"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("../services/logs/logger");
const httpLogger_1 = require("../services/logs/httpLogger");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const db_1 = __importDefault(require("../services/database/db"));
const routes_1 = __importDefault(require("../routes/routes"));
const index_1 = require("../middlewares/index");
const notificationRoute_1 = __importDefault(require("../routes/notificationRoute"));
// init env
dotenv_1.default.config();
(0, db_1.default)();
const server = (0, express_1.default)();
// middlewares
server.use((0, cors_1.default)());
server.use((0, morgan_1.default)("dev"));
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: false }));
server.use(httpLogger_1.httpLogger);
server.use(logger_1.errorLogger);
// server.use(requestLogger);
// server.use(limiter);
server.use((0, helmet_1.default)());
require("express-async-errors");
// server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// server.use(rules);
// global error handler
server.use(index_1.errorHandler);
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
server.use("/api/v1/auth", authController_1.default);
server.use("/api/v1", routes_1.default);
server.use("/api/v1/notifications", notificationRoute_1.default);
// Swagger
const swaggerDocs = (0, swagger_jsdoc_1.default)(index_1.swaggerOptions);
server.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
server.get("/", (req, res) => {
    res.status(200).send("Render deployment is working!");
});
// server start
server.listen(PORT, () => {
    logger_1.logger.info(`@@ Server started on http://localhost:${PORT}`);
});
exports.default = server;
