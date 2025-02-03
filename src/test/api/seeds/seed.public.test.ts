import request from "supertest";
import app from "../../../app";
import { prismaMock } from "../../setup";

describe("Seeds Public Endpoints", () => {
  const mockSeed = {
    id: 1,
    name: "Test Seed",
    description: "A test seed",
    pricePerKg: 100,
    kgPerAcre: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSeedWithFertilizers = {
    ...mockSeed,
    fertilizers: [
      {
        id: 1,
        name: "Test Fertilizer",
        description: "Compatible fertilizer",
        pricePerKg: 50,
        kgPerAcre: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/seeds", () => {
    it("should return paginated list of seeds", async () => {
      prismaMock.seed.findMany.mockResolvedValue([mockSeed]);
      prismaMock.seed.count.mockResolvedValue(1);

      const response = await request(app).get("/api/v1/seeds").expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.status).toBe(200);
    });

    it("should handle pagination parameters", async () => {
      prismaMock.seed.findMany.mockResolvedValue([]);
      prismaMock.seed.count.mockResolvedValue(0);

      await request(app).get("/api/v1/seeds?page=2&limit=10").expect(200);

      expect(prismaMock.seed.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe("GET /api/v1/seeds/:id", () => {
    it("should return seed details by ID", async () => {
      prismaMock.seed.findUnique.mockResolvedValue(mockSeed);

      const response = await request(app).get("/api/v1/seeds/1").expect(200);

      expect(response.body.data).toMatchObject({
        id: mockSeed.id,
        name: mockSeed.name,
      });
    });

    it("should return 404 for non-existent seed", async () => {
      prismaMock.seed.findUnique.mockResolvedValue(null);

      await request(app).get("/api/v1/seeds/999").expect(404);
    });

    it("should handle invalid ID format", async () => {
      await request(app).get("/api/v1/seeds/invalid-id").expect(400);
    });
  });

  describe("GET /api/v1/seeds/fertilizer/:fertilizerId", () => {
    it("should return seeds compatible with specific fertilizer", async () => {
      prismaMock.seed.findMany.mockResolvedValue([mockSeedWithFertilizers]);
      prismaMock.seed.count.mockResolvedValue(1);

      const response = await request(app)
        .get("/api/v1/seeds/fertilizer/1")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty("fertilizers");
    });

    it("should handle fertilizer with no compatible seeds", async () => {
      prismaMock.seed.findMany.mockResolvedValue([]);
      prismaMock.seed.count.mockResolvedValue(0);

      const response = await request(app)
        .get("/api/v1/seeds/fertilizer/999")
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.totalItems).toBe(0);
    });
  });

  describe("GET /api/v1/seeds/with-fertilizers", () => {
    it("should return seeds with their compatible fertilizers", async () => {
      prismaMock.seed.findMany.mockResolvedValue([mockSeedWithFertilizers]);
      prismaMock.seed.count.mockResolvedValue(1);

      const response = await request(app)
        .get("/api/v1/seeds/with-fertilizers")
        .expect(200);

      expect(response.body.data[0]).toHaveProperty("fertilizers");
      expect(response.body.data[0].fertilizers).toHaveLength(1);
    });
  });
});
