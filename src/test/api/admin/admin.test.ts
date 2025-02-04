import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";

jest.mock("../../../utils/auth", () => ({
  ...jest.requireActual("../../../utils/auth"),
  comparePassword: jest
    .fn()
    .mockImplementation((pwd, hash) =>
      Promise.resolve(hash === `hashed_${pwd}`),
    ),
  generateTokens: jest.fn().mockImplementation(() => ({
    accessToken: "mock_admin_token",
    expiresIn: 144000,
    isAdmin: true,
  })),
}));

describe("Admin Endpoints", () => {
  const mockAdminCredentials = {
    email: "admin@farmers.com",
    password: "adminPass123",
  };

  const mockAdmin = {
    id: 1,
    email: mockAdminCredentials.email,
    passwordHash: "hashed_adminPass123",
    firstName: "Super",
    lastName: "Admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/admin/login", () => {
    it("should authenticate admin with valid credentials", async () => {
      prismaMock.storeAdmin.findUnique.mockResolvedValue(mockAdmin);

      const response = await request(app)
        .post("/api/v1/admin/login")
        .send(mockAdminCredentials)
        .expect(200);

      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("isAdmin", true);
    });

    it("should reject invalid admin credentials", async () => {
      prismaMock.storeAdmin.findUnique.mockResolvedValue(mockAdmin);

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
      const response = await request(app)
        .post("/api/v1/admin/login")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
