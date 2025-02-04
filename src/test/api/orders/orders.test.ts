/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";
import { OrderStatus } from "@prisma/client";

// Mock tokens
const mockFarmerToken = "mock_farmer_token";
const mockAdminToken = "mock_admin_token";

// Mock authentication middleware
jest.mock("../../../middleware/auth.middleware", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (req.headers.authorization.includes("mock_farmer_token")) {
      req.user = { userId: 1, phoneNumber: "+250789123456" };
    }
    next();
  }),
  authenticateAdmin: jest.fn((req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (req.headers.authorization.includes("mock_admin_token")) {
      req.user = {
        userId: 999,
        phoneNumber: "admin@farmers.com",
        isAdmin: true,
      };
      return next();
    }
    return res.status(403).json({ error: "Admin access required" });
  }),
}));

describe("Orders System", () => {
  const mockOrder = {
    id: 1,
    farmerId: 1,
    landId: 1,
    status: "PENDING" as OrderStatus,
    totalAmount: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderDetails: [
      {
        id: 1,
        orderId: 1,
        seedId: 1,
        quantity: 25,
        price: 20,
        seed: {
          id: 1,
          name: "Test Seed",
          pricePerKg: 20,
          kgPerAcre: 25,
        },
      },
    ],
  };

  const mockLand = {
    id: 1,
    farmerId: 1,
    landSize: 5,
    upi: "UPI123",
    active: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.storeAdmin.findUnique.mockResolvedValue({
      id: 999,
      email: "admin@farmers.com",
    });
  });

  describe("POST /api/v1/orders", () => {
    const orderData = {
      landId: 1,
      seedId: 1,
    };

    it("should create new order successfully", async () => {
      prismaMock.land.findUnique.mockResolvedValue(mockLand);
      prismaMock.seed.findUnique.mockResolvedValue({
        id: 1,
        pricePerKg: 20,
        kgPerAcre: 25,
      });
      prismaMock.order.create.mockResolvedValue(mockOrder);

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${mockFarmerToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.data).toMatchObject({
        status: "PENDING",
        totalAmount: expect.any(Number),
      });
    });

    it("should validate land ownership", async () => {
      prismaMock.land.findUnique.mockResolvedValue({
        ...mockLand,
        farmerId: 999,
      });

      await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${mockFarmerToken}`)
        .send(orderData)
        .expect(400);
    });
  });

  describe("GET /api/v1/orders/my-orders", () => {
    it("should return farmer's orders", async () => {
      prismaMock.order.findMany.mockResolvedValue([mockOrder]);
      prismaMock.order.count.mockResolvedValue(1);

      const response = await request(app)
        .get("/api/v1/orders/my-orders")
        .set("Authorization", `Bearer ${mockFarmerToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body).toHaveProperty("pagination");
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/v1/orders/my-orders")
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });
  });

  describe("GET /api/v1/orders/pending", () => {
    it("should return pending orders for admin", async () => {
      prismaMock.order.findMany.mockResolvedValue([mockOrder]);
      prismaMock.order.count.mockResolvedValue(1);

      const response = await request(app)
        .get("/api/v1/orders/pending")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe("PENDING");
    });

    it("should require admin authentication", async () => {
      const response = await request(app)
        .get("/api/v1/orders/pending")
        .set("Authorization", `Bearer ${mockFarmerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("error", "Admin access required");
    });
  });

  describe("PUT /api/v1/orders/:id/status", () => {
    beforeEach(() => {
      prismaMock.order.findUnique.mockResolvedValue(mockOrder);
    });

    it("should update order status as admin", async () => {
      prismaMock.order.update.mockResolvedValue({
        ...mockOrder,
        status: "APPROVED",
      });

      const response = await request(app)
        .put("/api/v1/orders/1/status")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .send({ status: "APPROVED" })
        .expect(200);

      expect(response.body.data.status).toBe("APPROVED");
    });

    it("should validate status values", async () => {
      const response = await request(app)
        .put("/api/v1/orders/1/status")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .send({ status: "INVALID_STATUS" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle non-existent orders", async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/v1/orders/999/status")
        .set("Authorization", `Bearer ${mockAdminToken}`)
        .send({ status: "APPROVED" })
        .expect(404);

      expect(response.body).toHaveProperty(
        "error",
        "No order with the provided ID was found",
      );
    });

    it("should require admin authentication", async () => {
      const response = await request(app)
        .put("/api/v1/orders/1/status")
        .set("Authorization", `Bearer ${mockFarmerToken}`)
        .send({ status: "APPROVED" })
        .expect(403);

      expect(response.body).toHaveProperty("error", "Admin access required");
    });
  });
});
