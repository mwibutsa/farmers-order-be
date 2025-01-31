import { LandModel } from "#/models";
import { ILandInfoInput } from "#/interfaces/models";
import { Land } from "@prisma/client";

export default class LandService {
  static async getFarmersLands(farmerId: number, page = 1, limit = 5) {
    return LandModel.findMany({
      where: { farmerId },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  static async addLandInfo(data: ILandInfoInput): Promise<Land> {
    return LandModel.create({ data });
  }

  static async updateLand(
    landId: number,
    data: Partial<ILandInfoInput>,
  ): Promise<Land> {
    return LandModel.update({ where: { id: landId }, data });
  }

  static async findLandById(id: number): Promise<Land | null> {
    return LandModel.findUnique({ where: { id } });
  }

  static async findLandByUpi(upi: string): Promise<Land | null> {
    return LandModel.findUnique({ where: { upi } });
  }

  static async deleteLandInfo(id: number): Promise<Land> {
    return LandModel.delete({ where: { id } });
  }
}
