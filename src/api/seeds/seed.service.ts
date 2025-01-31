import { DatabaseError } from "#/lib/errors";
import { SeedModel } from "#/models";
import { Seed } from "@prisma/client";

export interface CreateSeedInput {
  name: string;
  description?: string;
  pricePerKg: number;
  kgPerAcre: number;
}

export default class SeedService {
  static async getAll(page = 1, limit = 5): Promise<Seed[]> {
    return SeedModel.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { name: "asc" },
    });
  }

  static async create(data: CreateSeedInput): Promise<Seed> {
    try {
      return await SeedModel.create({ data });
    } catch (error) {
      throw new DatabaseError(
        `Failed to create seed: ${(error as Error).message}`,
      );
    }
  }

  static async findById(id: number): Promise<Seed | null> {
    return SeedModel.findUnique({ where: { id } });
  }

  static async findByName(name: string): Promise<Seed | null> {
    return SeedModel.findFirst({ where: { name } });
  }

  static async update(
    id: number,
    data: Partial<CreateSeedInput>,
  ): Promise<Seed> {
    try {
      return await SeedModel.update({ where: { id }, data });
    } catch (error) {
      throw new DatabaseError(
        `Failed to update seed: ${(error as Error).message}`,
      );
    }
  }

  static async delete(id: number): Promise<Seed> {
    try {
      return await SeedModel.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete seed: ${(error as Error).message}`,
      );
    }
  }
}
