/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";

describe("Land Management Endpoints", () => {
  const mockLand = {
    id: 1,
    farmerId: 1,
    upi: "UPI123456",
    landSize: 5.5,
    location: "Test Location",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/land/farmers-land", () => {
    it("should return farmer's lands with pagination", async () => {
      prismaMock.land.findMany.mockResolvedValue([mockLand]);
      prismaMock.land.count.mockResolvedValue(1);

      const response = await request(app)
        .get("/api/v1/land/farmers-land")
        .set("Authorization", "Bearer valid-token")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.status).toBe(200);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/v1/land/farmers-land")
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });
  });

  describe("POST /api/v1/land/add-land-info", () => {
    const newLandData = {
      upi: "UPI123456",
      landSize: 5.5,
      location: "Test Location",
    };

    it("should add new land info successfully", async () => {
      prismaMock.land.findUnique.mockResolvedValue(null); // For LandService.findLandByUpi
      prismaMock.land.create.mockResolvedValue(mockLand);

      const response = await request(app)
        .post("/api/v1/land/add-land-info")
        .set("Authorization", "Bearer valid-token")
        .send(newLandData)
        .expect(201);

      expect(response.body.data).toMatchObject({
        upi: newLandData.upi,
        landSize: newLandData.landSize,
      });
    });

    it("should prevent duplicate UPI", async () => {
      prismaMock.land.findUnique.mockResolvedValue(mockLand); // For LandService.findLandByUpi

      const response = await request(app)
        .post("/api/v1/land/add-land-info")
        .set("Authorization", "Bearer valid-token")
        .send(newLandData)
        .expect(409);

      expect(response.body).toHaveProperty(
        "error",
        "Land with the same UPI already exists",
      );
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .post("/api/v1/land/add-land-info")
        .send(newLandData)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });

    it("should validate land size", async () => {
      const response = await request(app)
        .post("/api/v1/land/add-land-info")
        .set("Authorization", "Bearer valid-token")
        .send({
          ...newLandData,
          landSize: -1,
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle database errors", async () => {
      prismaMock.land.findUnique.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/v1/land/add-land-info")
        .set("Authorization", "Bearer valid-token")
        .send(newLandData)
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });
});
