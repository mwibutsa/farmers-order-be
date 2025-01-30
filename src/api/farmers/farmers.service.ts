import { DatabaseError } from "@/lib/errors";
import { FarmerModel } from "@/models";
import { hashPassword } from "@/utils/auth";
import { Farmer } from "@prisma/client";

type TFarmerInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
};
export default class FarmersService {
  static async getAll(): Promise<Farmer[]> {
    const result = await FarmerModel.findMany();
    return result;
  }

  static async findByPhone(phoneNumber: string) {
    return FarmerModel.findFirst({
      where: { phoneNumber },
    });
  }

  static async create(data: TFarmerInput) {
    try {
      const { password, ...restData } = data;
      const passwordHash = await hashPassword(password);
      const newUser = await FarmerModel.create({
        data: {
          ...restData,
          passwordHash,
        },
      });
      return newUser;
    } catch (error) {
      throw new DatabaseError(
        `Failed to create user account: ${(error as Error).message}`,
        true,
      );
    }
  }
}
