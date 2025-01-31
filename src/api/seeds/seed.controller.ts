import { Response } from "express";
import { AuthRequest } from "#/interfaces/models";
import SeedService, { CreateSeedInput } from "./seed.service";
import { HTTP_CONFLICT, HTTP_CREATED, HTTP_OK } from "#/constants/httpStatus";

export default class SeedController {
  static async getAllSeeds(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const seeds = await SeedService.getAll(
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json({ data: seeds });
  }

  static async createSeed(req: AuthRequest, res: Response) {
    const data = req.body as CreateSeedInput;

    const exists = await SeedService.findByName(data.name);
    if (exists) {
      return res.status(HTTP_CONFLICT).json({
        error: "Seed with this name already exists",
      });
    }

    const seed = await SeedService.create(data);
    return res.status(HTTP_CREATED).json({ data: seed });
  }

  static async updateSeed(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body as Partial<CreateSeedInput>;

    const seed = await SeedService.update(Number(id), data);
    return res.status(HTTP_OK).json({ data: seed });
  }

  static async deleteSeed(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const seed = await SeedService.delete(Number(id));
    return res.status(HTTP_OK).json({ data: seed });
  }
}
