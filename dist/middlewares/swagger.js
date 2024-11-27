"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Ono API",
            version: "1.0.0",
            description: "API for Ono app with authentication",
        },
    },
    apis: ["./../routes/*.ts"], // Define paths for Swagger to look for doc comments
};
