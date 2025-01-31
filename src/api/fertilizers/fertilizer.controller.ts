import { Response } from "express";
import { AuthRequest } from "#/interfaces/models";
import FertilizerService, { CreateFertilizerInput } from "./fertilizer.service";
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "#/constants/httpStatus";

export default class FertilizerController {
  static async getAllFertilizers(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const fertilizers = await FertilizerService.getAll(
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json({ data: fertilizers });
  }

  static async createFertilizer(req: AuthRequest, res: Response) {
    const data = req.body as CreateFertilizerInput;

    const exists = await FertilizerService.findByName(data.name);
    if (exists) {
      return res.status(HTTP_CONFLICT).json({
        error: "Fertilizer with this name already exists",
      });
    }

    const fertilizer = await FertilizerService.create(data);
    return res.status(HTTP_CREATED).json({ data: fertilizer });
  }

  static async updateFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body as Partial<CreateFertilizerInput>;

    const fertilizer = await FertilizerService.update(Number(id), data);
    if (!fertilizer) {
      return res.status(HTTP_NOT_FOUND).json({
        error: "Fertilizer not found",
      });
    }

    return res.status(HTTP_OK).json({ data: fertilizer });
  }

  static async getFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const fertilizer = await FertilizerService.findById(Number(id));

    if (!fertilizer) {
      return res.status(HTTP_NOT_FOUND).json({
        error: "Fertilizer not found",
      });
    }

    return res.status(HTTP_OK).json({ data: fertilizer });
  }

  static async deleteFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const fertilizer = await FertilizerService.delete(Number(id));
    return res.status(HTTP_OK).json({ data: fertilizer });
  }
}
