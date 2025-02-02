import { CreateSeedInput, PaginatedResponse } from "#/interfaces/models";
import { DatabaseError } from "#/lib/errors";
import { SeedModel } from "#/models";
import { Fertilizer, Seed } from "@prisma/client";

export type SeedWithFertilizers = Seed & {
  fertilizers: Fertilizer[];
};

export default class SeedService {
  /**
   * Get all seeds
   */
  static async getAll(page = 1, limit = 5): Promise<PaginatedResponse<Seed>> {
    try {
      const seeds = await SeedModel.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      });

      const totalItems = await SeedModel.count();

      return {
        data: seeds,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch seeds: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Create a new seed
   */
  static async create(data: CreateSeedInput): Promise<Seed> {
    try {
      return await SeedModel.create({ data });
    } catch (error) {
      throw new DatabaseError(
        `Failed to create seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Find seed by ID with optional fertilizer relations
   */
  static async findById(
    id: number,
    includeFertilizers = false,
  ): Promise<Seed | SeedWithFertilizers | null> {
    try {
      return SeedModel.findUnique({
        where: { id },
        include: {
          fertilizers: includeFertilizers,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Find seed by name with optional fertilizer relations
   */
  static async findByName(
    name: string,
    includeFertilizers = false,
  ): Promise<Seed | SeedWithFertilizers | null> {
    try {
      return SeedModel.findFirst({
        where: { name },
        include: {
          fertilizers: includeFertilizers,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Update seed information
   */
  static async update(
    id: number,
    data: Partial<CreateSeedInput>,
  ): Promise<Seed> {
    try {
      return await SeedModel.update({
        where: { id },
        data,
        include: {
          fertilizers: true,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to update seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Delete a seed
   */
  static async delete(id: number): Promise<Seed> {
    try {
      return await SeedModel.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Get seeds compatible with a specific fertilizer
   */
  static async getSeedsByFertilizer(
    fertilizerId: number,
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<SeedWithFertilizers>> {
    try {
      const seeds = await SeedModel.findMany({
        where: {
          fertilizers: {
            some: {
              id: fertilizerId,
            },
          },
        },
        include: {
          fertilizers: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      });

      const totalItems = await SeedModel.count({
        where: {
          fertilizers: {
            some: {
              id: fertilizerId,
            },
          },
        },
      });

      return {
        data: seeds,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch seeds by fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Get all seeds with their compatible fertilizers
   */
  static async getAllSeedsWithFertilizers(
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<SeedWithFertilizers>> {
    try {
      const seeds = await SeedModel.findMany({
        include: {
          fertilizers: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      });

      const totalItems = await SeedModel.count();

      return {
        data: seeds,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch seeds with fertilizers: ${(error as Error).message}`,
      );
    }
  }
}
