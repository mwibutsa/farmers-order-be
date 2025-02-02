import { DatabaseError } from "#lib/errors";
import { FertilizerModel } from "#/models";
import { prisma } from "#lib/prisma";
import { PaginatedResponse } from "#/interfaces/models";
import { Fertilizer, Seed } from "@prisma/client";

export interface CreateFertilizerInput {
  name: string;
  description?: string;
  pricePerKg: number;
  kgPerAcre: number;
  compatibleSeedIds?: number[];
}
export default class FertilizerService {
  static async getAll(page = 1, limit = 5) {
    const fertilizers = await FertilizerModel.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { name: "asc" },
      include: { seedTypes: true },
    });

    const totalItems = await FertilizerModel.count();
    return {
      data: fertilizers,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }

  static async getFertilizersBySeed(
    seedId: number,
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<Fertilizer & { seedTypes: Seed[] }>> {
    const fertilizers = await FertilizerModel.findMany({
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

    const totalItems = await FertilizerModel.count({
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
  }
  static async create(data: CreateFertilizerInput) {
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

  static async update(id: number, data: Partial<CreateFertilizerInput>) {
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

  static async delete(id: number) {
    try {
      return await FertilizerModel.delete({ where: { id } });
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete fertilizer: ${(error as Error).message}`,
      );
    }
  }

  static async findById(id: number) {
    return FertilizerModel.findUnique({
      where: { id },
      include: { seedTypes: true },
    });
  }

  static async findByName(name: string) {
    return FertilizerModel.findFirst({
      where: { name },
      include: { seedTypes: true },
    });
  }

  static async getAllFertilizersWithSeeds(
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<Fertilizer & { seedTypes: Seed[] }>> {
    const fertilizers = await FertilizerModel.findMany({
      include: {
        seedTypes: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { name: "asc" },
    });

    const totalItems = await FertilizerModel.count();

    return {
      data: fertilizers,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    };
  }
}
