"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = exports.logger = void 0;
require("winston-daily-rotate-file");
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { combine, timestamp, printf, colorize, align, json, prettyPrint, cli } = winston_1.default.format;
const options = {
    file: {
        level: "info",
        filename: "./logs/temp/app-info-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        handleExceptions: true,
        json: true,
        // maxsize: 5242880, // 5MB
        maxSize: "20m",
        maxFiles: "15d",
        colorize: true,
    },
    errorFile: {
        level: "error",
        filename: "./logs/temp/app-error-log-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        handleExceptions: true,
        json: false,
        // maxsize: 5242880, // 5MB
        maxSize: "20m",
        maxFiles: "15d",
        colorize: true,
    },
    exceptionFile: {
        level: "exception",
        filename: "./logs/temp/app-exception-log-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        handleExceptions: true,
        json: false,
        // maxsize: 5242880, // 5MB
        maxSize: "20m",
        maxFiles: "15d",
        colorize: true,
    },
    rejectionFile: {
        level: "rejection",
        filename: "./logs/temp/app-rejection-log-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        handleRejections: true,
        json: false,
        // maxsize: 5242880, // 5MB
        maxSize: "20m",
        maxFiles: "15d",
        colorize: true,
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
// console logger
const consoleLogger = new winston_1.default.transports.Console(Object.assign(Object.assign({}, options.console), { format: combine(colorize(), timestamp({ format: "MM-DD hh:mm A" }), prettyPrint(), 
    // align(),
    // cli(),
    // json(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)) }));
// file logger daily rotate
const fileRotateLogTransport = new winston_1.default.transports.DailyRotateFile(Object.assign(Object.assign({}, options.file), { format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), align(), prettyPrint(), 
    // json(),
    printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)) }));
// error file logger
const errorFileRotateLogTransport = new winston_1.default.transports.DailyRotateFile(Object.assign(Object.assign({}, options.errorFile), { format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), align(), prettyPrint(), printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)) }));
const exceptionFileRotateTransport = new winston_1.default.transports.DailyRotateFile(Object.assign(Object.assign({}, options.exceptionFile), { format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), align(), prettyPrint(), printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)) }));
const rejectionFileRotateTransport = new winston_1.default.transports.DailyRotateFile(Object.assign(Object.assign({}, options.rejectionFile), { format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), align(), prettyPrint(), printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)) }));
let logger;
if (process.env.NODE_ENV !== "production") {
    // create a logger
    exports.logger = logger = winston_1.default.createLogger({
        levels: winston_1.default.config.npm.levels,
        transports: [
            fileRotateLogTransport,
            errorFileRotateLogTransport,
            consoleLogger,
        ],
        exceptionHandlers: [exceptionFileRotateTransport],
        rejectionHandlers: [rejectionFileRotateTransport],
        exitOnError: false,
    });
}
else {
    exports.logger = logger = winston_1.default.createLogger({
        level: "debug",
        levels: winston_1.default.config.npm.levels,
        transports: [fileRotateLogTransport, errorFileRotateLogTransport],
        exceptionHandlers: [exceptionFileRotateTransport],
        exitOnError: false,
    });
}
// Request logging
const requestLogger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(
            // winston.format.colorize(),
            prettyPrint(), winston_1.default.format.json()),
        }),
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});
exports.requestLogger = requestLogger;
// Error logging
const errorLogger = express_winston_1.default.errorLogger({
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(
            // winston.format.colorize(),
            prettyPrint(), winston_1.default.format.json()),
        }),
    ],
});
exports.errorLogger = errorLogger;
