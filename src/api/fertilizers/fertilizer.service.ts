import { DatabaseError } from "#lib/errors";
import { prisma } from "#lib/prisma";
import {
  CreateFertilizerInput,
  FertilizerWithSeeds,
  PaginatedResponse,
} from "#/interfaces/models";
import { Fertilizer } from "@prisma/client";

export default class FertilizerService {
  /**
   * Get all fertilizers
   */
  static async getAll(
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<FertilizerWithSeeds>> {
    try {
      const fertilizers = await prisma.fertilizer.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
        include: { seedTypes: true },
      });

      const totalItems = await prisma.fertilizer.count();

      return {
        data: fertilizers,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch fertilizers: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Get fertilizers compatible with a specific seed
   */
  static async getFertilizersBySeed(
    seedId: number,
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<FertilizerWithSeeds>> {
    try {
      const fertilizers = await prisma.fertilizer.findMany({
        where: {
          seedTypes: {
            some: {
              id: seedId,
            },
          },
        },
        include: {
          seedTypes: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      });

      const totalItems = await prisma.fertilizer.count({
        where: {
          seedTypes: {
            some: {
              id: seedId,
            },
          },
        },
      });

      return {
        data: fertilizers,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch fertilizers by seed: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Create a new fertilizer
   */
  static async create(
    data: CreateFertilizerInput,
  ): Promise<FertilizerWithSeeds> {
    const { compatibleSeedIds, ...fertilizerData } = data;

    try {
      return await prisma.fertilizer.create({
        data: {
          ...fertilizerData,
          seedTypes: compatibleSeedIds
            ? {
                connect: compatibleSeedIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: { seedTypes: true },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to create fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Update fertilizer information
   */
  static async update(
    id: number,
    data: Partial<CreateFertilizerInput>,
  ): Promise<FertilizerWithSeeds> {
    const { compatibleSeedIds, ...updateData } = data;

    try {
      return await prisma.fertilizer.update({
        where: { id },
        data: {
          ...updateData,
          seedTypes: compatibleSeedIds
            ? {
                set: compatibleSeedIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: { seedTypes: true },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to update fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Delete a fertilizer
   */
  static async delete(id: number): Promise<Fertilizer> {
    try {
      return await prisma.fertilizer.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Find fertilizer by ID with seeds
   */
  static async findById(id: number): Promise<FertilizerWithSeeds | null> {
    try {
      return await prisma.fertilizer.findUnique({
        where: { id },
        include: { seedTypes: true },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Find fertilizer by name with seeds
   */
  static async findByName(name: string): Promise<FertilizerWithSeeds | null> {
    try {
      return await prisma.fertilizer.findFirst({
        where: { name },
        include: { seedTypes: true },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch fertilizer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Get all fertilizers with their compatible seeds
   */
  static async getAllFertilizersWithSeeds(
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<FertilizerWithSeeds>> {
    try {
      const fertilizers = await prisma.fertilizer.findMany({
        include: {
          seedTypes: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { name: "asc" },
      });

      const totalItems = await prisma.fertilizer.count();

      return {
        data: fertilizers,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch fertilizers with seeds: ${(error as Error).message}`,
      );
    }
  }
}
