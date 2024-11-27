"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../services/logs/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong !" });
};
exports.errorHandler = errorHandler;
