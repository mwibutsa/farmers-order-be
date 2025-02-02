import { DatabaseError } from "#lib/errors";
import { FarmerModel } from "#/models/index";
import { hashPassword } from "#utils/auth";
import { Farmer } from "@prisma/client";
import {
  CreateFarmerInput,
  PaginatedResponse,
  PublicFarmer,
} from "#/interfaces/models";

export default class FarmersService {
  /**
   * Get all farmers with pagination
   */
  static async getAll(
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<PublicFarmer>> {
    try {
      const farmers = await FarmerModel.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { firstName: "asc" },
      });

      const totalItems = await FarmerModel.count();

      const publicFarmers = farmers.map((farmer) => {
        const publicData: Partial<Farmer> = { ...farmer };
        delete publicData.passwordHash;
        return publicData as PublicFarmer;
      });

      return {
        data: publicFarmers,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
        },
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch farmers: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Find farmer by phone number
   */
  static async findByPhone(phoneNumber: string): Promise<Farmer | null> {
    try {
      return await FarmerModel.findFirst({
        where: { phoneNumber },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to find farmer: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Create new farmer account
   */
  static async create(data: CreateFarmerInput): Promise<PublicFarmer> {
    try {
      const { password, ...restData } = data;
      const passwordHash = await hashPassword(password);
      const newUser = await FarmerModel.create({
        data: {
          ...restData,
          passwordHash,
        },
      });

      const publicUserData: Partial<Farmer> = { ...newUser };
      delete publicUserData.passwordHash;
      return publicUserData as PublicFarmer;
    } catch (error) {
      throw new DatabaseError(
        `Failed to create user account: ${(error as Error).message}`,
      );
    }
  }
}
