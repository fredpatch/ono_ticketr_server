import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import server from "../src/server";
import User from "../models/User"; // Import your User model
import bcrypt from "bcryptjs";

describe("POST /api/v1/auth/signin", () => {
  let mockUser;

  beforeEach(async () => {
    // Create a mock user for testing
    mockUser = new User({
      personal_info: {
        fullname: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      google_auth: false,
    });
    await mockUser.save();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
  });

  it("should successfully sign in with valid credentials", async () => {
    const response = await request(server).post("/api/v1/auth/signin").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("profile_img");
    // expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty("fullname");
    expect(response.body).toHaveProperty("isAdmin");
  });

  it("should return 403 for invalid password", async () => {
    const response = await request(server).post("/api/v1/auth/signin").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Invalid password please try again.");
  });

  it("should return 403 if email is not found", async () => {
    const response = await request(server).post("/api/v1/auth/signin").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Email not found");
  });
});

describe("POST /api/v1/auth/signup", () => {
  afterEach(async () => {
    // Clean up the User collection after each test
    await User.deleteMany({});
  });

  it("should successfully sign up a new user", async () => {
    const response = await request(server).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      password: "Password123",
      fullname: "Test User",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("profile_img");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("fullname");
    expect(response.body).toHaveProperty("isAdmin", false); // Adjust based on your default value
  });

  it("should return an error for an existing email", async () => {
    // Create a mock user for testing
    const mockUser = new User({
      personal_info: {
        fullname: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      google_auth: false,
    });
    await mockUser.save();

    // Attempt to sign up with the existing email
    const response = await request(server).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      password: "Newpassword456",
      fullname: "Another User",
    });

    // Assert the response status and body
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Email already exists");

    // Clean up the database after each test
    await User.deleteMany({});
  });

  it("should return a validation error for missing fullname", async () => {
    const response = await request(server).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      password: "Password123",
      fullname: "",
    });

    expect(response.status).toBe(400); // Adjust based on your actual error handling
    expect(response.body).toHaveProperty("error");
  });

  // Add more tests for email and password validation as needed

  it("should return a validation error for missing email", async () => {
    const response = await request(server).post("/api/v1/auth/signup").send({
      password: "Password123",
      fullname: "Test User",
      email: "",
    });

    expect(response.status).toBe(400); // Adjust based on your actual error handling
    expect(response.body).toHaveProperty("error");
  });

  it("should return a validation error for incorrect format email", async () => {
    const response = await request(server).post("/api/v1/auth/signup").send({
      password: "Password123",
      fullname: "Test User",
      email: "testexample.com",
    });

    expect(response.status).toBe(400); // Adjust based on your actual error handling
    expect(response.body).toHaveProperty("error");
  });

  it("should return a validation error for missing password", async () => {
    const response = await request(server).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      fullname: "Test User",
    });

    expect(response.status).toBe(400); // Adjust based on your actual error handling
    expect(response.body).toHaveProperty("error");
  });
});
