import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";
import { StoreAdmin } from "@prisma/client";
import * as auth from "../../../utils/auth";

// Mock the auth utilities
jest.mock("../../../utils/auth", () => ({
  comparePassword: jest.fn(),
  generateTokens: jest.fn(),
}));

interface AdminCredentials {
  email: string;
  password: string;
}

interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
  isAdmin: boolean;
}

describe("Admin Endpoints", () => {
  const mockAdminCredentials: AdminCredentials = {
    email: "admin@farmers.com",
    password: "adminPass123",
  };

  const mockAdmin: StoreAdmin = {
    id: 1,
    email: mockAdminCredentials.email,
    passwordHash: "hashedPassword123",
    firstName: "Super",
    lastName: "Admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.comparePassword as jest.Mock).mockResolvedValue(true);
    (auth.generateTokens as jest.Mock).mockReturnValue({
      accessToken: "mock_admin_token",
      expiresIn: 144000,
      isAdmin: true,
    });
  });

  describe("POST /api/v1/admin/login", () => {
    it("should authenticate admin with valid credentials", async () => {
      prismaMock.storeAdmin.findUnique.mockResolvedValue(mockAdmin);

      const response = await request(app)
        .post("/api/v1/admin/login")
        .send(mockAdminCredentials)
        .expect(200);

      const body = response.body as { data: AuthTokenResponse };
      expect(body.data).toHaveProperty("accessToken");
      expect(body.data).toHaveProperty("isAdmin", true);
      expect(auth.comparePassword).toHaveBeenCalledWith(
        mockAdminCredentials.password,
        mockAdmin.passwordHash,
      );
    });

    it("should reject invalid admin credentials", async () => {
      prismaMock.storeAdmin.findUnique.mockResolvedValue(mockAdmin);
      (auth.comparePassword as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post("/api/v1/admin/login")
        .send({
          ...mockAdminCredentials,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should handle non-existent admin", async () => {
      prismaMock.storeAdmin.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/admin/login")
        .send(mockAdminCredentials)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should validate email format", async () => {
      const invalidCredentials: AdminCredentials = {
        email: "not-an-email",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/admin/login")
        .send(invalidCredentials)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});
