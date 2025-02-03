/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";

jest.mock("../../../utils/auth", () => ({
  ...jest.requireActual("../../../utils/auth"),
  hashPassword: jest
    .fn()
    .mockImplementation((pwd) => Promise.resolve(`hashed_${pwd}`)),
  comparePassword: jest
    .fn()
    .mockImplementation((pwd, hash) =>
      Promise.resolve(hash === `hashed_${pwd}`),
    ),
  generateTokens: jest.fn().mockImplementation(() => ({
    accessToken: "test_token",
    expiresIn: 144000,
  })),
}));

describe("Farmer Authentication", () => {
  describe("POST /api/v1/farmers/sign-up", () => {
    const validSignupData = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+250789123456",
      password: "Password123!",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new farmer account successfully", async () => {
      const mockCreatedFarmer = {
        id: 1,
        ...validSignupData,
        passwordHash: "hashed_Password123!",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.farmer.findFirst.mockResolvedValue(null); // No existing user
      prismaMock.farmer.create.mockResolvedValue(mockCreatedFarmer);

      const response = await request(app)
        .post("/api/v1/farmers/sign-up")
        .send(validSignupData)
        .expect(201);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).not.toHaveProperty("passwordHash");
      expect(response.body.status).toBe(201);
    });

    it("should prevent duplicate phone numbers", async () => {
      prismaMock.farmer.findFirst.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post("/api/v1/farmers/sign-up")
        .send(validSignupData)
        .expect(409);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("already exists");
    });

    it("should validate required fields", async () => {
      const invalidData = {
        firstName: "John",
        // Missing other required fields
      };

      const response = await request(app)
        .post("/api/v1/farmers/sign-up")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should validate phone number format", async () => {
      const invalidPhone = {
        ...validSignupData,
        phoneNumber: "123456", // Invalid format
      };

      const response = await request(app)
        .post("/api/v1/farmers/sign-up")
        .send(invalidPhone)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/v1/farmers/login", () => {
    const validLoginData = {
      phoneNumber: "+250789123456",
      password: "Password123!",
    };

    it("should login successfully with valid credentials", async () => {
      const mockFarmer = {
        id: 1,
        phoneNumber: validLoginData.phoneNumber,
        passwordHash: `hashed_${validLoginData.password}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.farmer.findFirst.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .post("/api/v1/farmers/login")
        .send(validLoginData)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.status).toBe(200);
    });

    it("should reject invalid credentials", async () => {
      const invalidLoginData = {
        ...validLoginData,
        password: "WrongPassword123!",
      };

      const mockFarmer = {
        id: 1,
        phoneNumber: validLoginData.phoneNumber,
        passwordHash: `hashed_${validLoginData.password}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.farmer.findFirst.mockResolvedValue(mockFarmer);

      const response = await request(app)
        .post("/api/v1/farmers/login")
        .send(invalidLoginData)
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Invalid account credentials");
    });

    it("should handle non-existent accounts", async () => {
      prismaMock.farmer.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/farmers/login")
        .send(validLoginData)
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should validate phone number format", async () => {
      const invalidPhone = {
        ...validLoginData,
        phoneNumber: "123456",
      };

      const response = await request(app)
        .post("/api/v1/farmers/login")
        .send(invalidPhone)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
