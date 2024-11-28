import "winston-daily-rotate-file";
import winston from "winston";
import expressWinston from "express-winston";
import dotenv from "dotenv";
dotenv.config();

const { combine, timestamp, printf, colorize, align, json, prettyPrint, cli } =
  winston.format;

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
const consoleLogger = new winston.transports.Console({
  ...options.console,
  format: combine(
    colorize(),
    timestamp({ format: "MM-DD hh:mm A" }),
    prettyPrint(),
    // align(),
    // cli(),
    // json(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
});

// file logger daily rotate
const fileRotateLogTransport = new winston.transports.DailyRotateFile({
  ...options.file,

  format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    prettyPrint(),
    // json(),
    printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
  ),
});

// error file logger
const errorFileRotateLogTransport = new winston.transports.DailyRotateFile({
  ...options.errorFile,

  format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    prettyPrint(),
    printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
  ),
});

const exceptionFileRotateTransport = new winston.transports.DailyRotateFile({
  ...options.exceptionFile,

  format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    prettyPrint(),
    printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
  ),
});

const rejectionFileRotateTransport = new winston.transports.DailyRotateFile({
  ...options.rejectionFile,

  format: combine(
    // colorize(),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    align(),
    prettyPrint(),
    printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
  ),
});

let logger;

if (process.env.NODE_ENV !== "test") {
  // create a logger
  logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: [
      fileRotateLogTransport,
      errorFileRotateLogTransport,
      consoleLogger,
    ],
    exceptionHandlers: [exceptionFileRotateTransport],
    rejectionHandlers: [rejectionFileRotateTransport],
    exitOnError: false,
  });
} else {
  logger = winston.createLogger({
    level: "debug",
    levels: winston.config.npm.levels,
    transports: [fileRotateLogTransport, errorFileRotateLogTransport],
    exceptionHandlers: [exceptionFileRotateTransport],

    exitOnError: false,
  });
}
// Request logging
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        // colorize(),
        prettyPrint(),
        align(),
        printf(
          (request) =>
            `[${request.meta.req.method}]:: => [${
              request.meta.req.url
            }] || Status Code:[${
              request.meta.res.statusCode
            }] || Response Time:[${
              request.meta.responseTime
            }] || Content Type:[${
              request.meta.req.headers["content-type"]
            }] || User Agent:[${
              request.meta.req.headers["user-agent"]
            }] || Authorization:[${JSON.stringify(
              request.meta.req.headers["authorization"]
            )}] || Cache control:[${
              request.meta.req.headers["cache-control"]
            }] || Host:[${
              request.meta.req.headers["host"]
            }] || Query:[${JSON.stringify(request.meta.req.query)}]`
        )
        // winston.format.errors({ stack: true }),
        // winston.format.splat(),
        // winston.format.json()
      ),
    }),
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

// Error logging
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        prettyPrint(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
    }),
  ],
});

export { logger, requestLogger, errorLogger };
