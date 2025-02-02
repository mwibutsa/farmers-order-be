import { Response } from "express";
import { AuthRequest, CreateFertilizerInput } from "#/interfaces/models";
import FertilizerService from "./fertilizer.service";
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "#/constants/httpStatus";

export default class FertilizerController {
  /**
   * Get all fertilizers
   */
  static async getAllFertilizers(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const fertilizers = await FertilizerService.getAll(
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json(fertilizers);
  }

  /**
   * Get all fertilizers with their compatible seeds
   */
  static async getAllFertilizersWithSeeds(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const fertilizers = await FertilizerService.getAllFertilizersWithSeeds(
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json(fertilizers);
  }

  /**
   * Get fertilizers compatible with a specific seed
   */
  static async getFertilizersBySeed(req: AuthRequest, res: Response) {
    const { seedId } = req.params;
    const { page, limit } = req.query;

    const fertilizers = await FertilizerService.getFertilizersBySeed(
      Number(seedId),
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json(fertilizers);
  }

  /**
   * Create a new fertilizer
   */
  static async createFertilizer(req: AuthRequest, res: Response) {
    const data = req.body as CreateFertilizerInput;

    const exists = await FertilizerService.findByName(data.name);
    if (exists) {
      return res.status(HTTP_CONFLICT).json({
        error: "Fertilizer with this name already exists",
      });
    }

    const fertilizer = await FertilizerService.create(data);
    return res.status(HTTP_CREATED).json({
      data: fertilizer,
      status: HTTP_CREATED,
    });
  }

  /**
   * Update fertilizer information
   */
  static async updateFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = req.body as Partial<CreateFertilizerInput>;

    // Check if fertilizer exists
    const existingFertilizer = await FertilizerService.findById(Number(id));
    if (!existingFertilizer) {
      return res.status(HTTP_NOT_FOUND).json({
        error: "Fertilizer not found",
      });
    }

    // If name is being updated, check for conflicts
    if (data.name && data.name !== existingFertilizer.name) {
      const nameExists = await FertilizerService.findByName(data.name);
      if (nameExists) {
        return res.status(HTTP_CONFLICT).json({
          error: "Fertilizer with this name already exists",
        });
      }
    }

    const fertilizer = await FertilizerService.update(Number(id), data);
    return res.status(HTTP_OK).json({
      data: fertilizer,
      status: HTTP_OK,
    });
  }

  /**
   * Get fertilizer by ID
   */
  static async getFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const fertilizer = await FertilizerService.findById(Number(id));

    if (!fertilizer) {
      return res.status(HTTP_NOT_FOUND).json({
        error: "Fertilizer not found",
      });
    }

    return res.status(HTTP_OK).json({
      data: fertilizer,
      status: HTTP_OK,
    });
  }

  /**
   * Delete a fertilizer
   */
  static async deleteFertilizer(req: AuthRequest, res: Response) {
    const { id } = req.params;

    // Check if fertilizer exists before deletion
    const existingFertilizer = await FertilizerService.findById(Number(id));
    if (!existingFertilizer) {
      return res.status(HTTP_NOT_FOUND).json({
        error: "Fertilizer not found",
      });
    }

    const fertilizer = await FertilizerService.delete(Number(id));
    return res.status(HTTP_OK).json({
      data: fertilizer,
      status: HTTP_OK,
    });
  }
}
