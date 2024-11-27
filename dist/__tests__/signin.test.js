"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const User_1 = __importDefault(require("../models/User")); // Import your User model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, vitest_1.describe)("POST /api/v1/auth/signin", () => {
    let mockUser;
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a mock user for testing
        mockUser = new User_1.default({
            personal_info: {
                fullname: "Test User",
                email: "test@example.com",
                password: yield bcryptjs_1.default.hash("password123", 10),
            },
            google_auth: false,
        });
        yield mockUser.save();
    }));
    (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database after each test
        yield User_1.default.deleteMany({});
    }));
    (0, vitest_1.it)("should successfully sign in with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signin").send({
            email: "test@example.com",
            password: "password123",
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toHaveProperty("access_token");
        (0, vitest_1.expect)(response.body).toHaveProperty("profile_img");
        // expect(response.body).toHaveProperty('username');
        (0, vitest_1.expect)(response.body).toHaveProperty("fullname");
        (0, vitest_1.expect)(response.body).toHaveProperty("isAdmin");
    }));
    (0, vitest_1.it)("should return 403 for invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signin").send({
            email: "test@example.com",
            password: "wrongpassword",
        });
        (0, vitest_1.expect)(response.status).toBe(403);
        (0, vitest_1.expect)(response.body.error).toBe("Invalid password please try again.");
    }));
    (0, vitest_1.it)("should return 403 if email is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signin").send({
            email: "nonexistent@example.com",
            password: "password123",
        });
        (0, vitest_1.expect)(response.status).toBe(403);
        (0, vitest_1.expect)(response.body.error).toBe("Email not found");
    }));
});
(0, vitest_1.describe)("POST /api/v1/auth/signup", () => {
    (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the User collection after each test
        yield User_1.default.deleteMany({});
    }));
    (0, vitest_1.it)("should successfully sign up a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            email: "test@example.com",
            password: "Password123",
            fullname: "Test User",
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toHaveProperty("access_token");
        (0, vitest_1.expect)(response.body).toHaveProperty("profile_img");
        (0, vitest_1.expect)(response.body).toHaveProperty("username");
        (0, vitest_1.expect)(response.body).toHaveProperty("fullname");
        (0, vitest_1.expect)(response.body).toHaveProperty("isAdmin", false); // Adjust based on your default value
    }));
    (0, vitest_1.it)("should return an error for an existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a mock user for testing
        const mockUser = new User_1.default({
            personal_info: {
                fullname: "Test User",
                email: "test@example.com",
                password: yield bcryptjs_1.default.hash("password123", 10),
            },
            google_auth: false,
        });
        yield mockUser.save();
        // Attempt to sign up with the existing email
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            email: "test@example.com",
            password: "Newpassword456",
            fullname: "Another User",
        });
        // Assert the response status and body
        (0, vitest_1.expect)(response.status).toBe(500);
        (0, vitest_1.expect)(response.body).toHaveProperty("error", "Email already exists");
        // Clean up the database after each test
        yield User_1.default.deleteMany({});
    }));
    (0, vitest_1.it)("should return a validation error for missing fullname", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            email: "test@example.com",
            password: "Password123",
            fullname: "",
        });
        (0, vitest_1.expect)(response.status).toBe(400); // Adjust based on your actual error handling
        (0, vitest_1.expect)(response.body).toHaveProperty("error");
    }));
    // Add more tests for email and password validation as needed
    (0, vitest_1.it)("should return a validation error for missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            password: "Password123",
            fullname: "Test User",
            email: "",
        });
        (0, vitest_1.expect)(response.status).toBe(400); // Adjust based on your actual error handling
        (0, vitest_1.expect)(response.body).toHaveProperty("error");
    }));
    (0, vitest_1.it)("should return a validation error for incorrect format email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            password: "Password123",
            fullname: "Test User",
            email: "testexample.com",
        });
        (0, vitest_1.expect)(response.status).toBe(400); // Adjust based on your actual error handling
        (0, vitest_1.expect)(response.body).toHaveProperty("error");
    }));
    (0, vitest_1.it)("should return a validation error for missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/v1/auth/signup").send({
            email: "test@example.com",
            fullname: "Test User",
        });
        (0, vitest_1.expect)(response.status).toBe(400); // Adjust based on your actual error handling
        (0, vitest_1.expect)(response.body).toHaveProperty("error");
    }));
});
