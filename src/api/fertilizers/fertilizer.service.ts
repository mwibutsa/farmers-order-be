import { DatabaseError } from "#lib/errors";
import { FertilizerModel } from "#/models";
import { prisma } from "#lib/prisma";

export interface CreateFertilizerInput {
  name: string;
  description?: string;
  pricePerKg: number;
  kgPerAcre: number;
  compatibleSeedIds?: number[];
}
export default class FertilizerService {
  static async getAll(page = 1, limit = 5) {
    return FertilizerModel.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { name: "asc" },
      include: { seedTypes: true },
    });
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
}
