import { Response } from "express";
import { AuthRequest, CreateSeedInput } from "#/interfaces/models";
import SeedService from "./seed.service";
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_BAD_REQUEST,
} from "#/constants/httpStatus";
import { ApiResponse, ApiError } from "#/interfaces/request";
import { Seed } from "@prisma/client";
import { SeedWithFertilizers } from "./seed.service";

export default class SeedController {
  /**
   * Get all seeds
   */
  static async getAllSeeds(req: AuthRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await SeedService.getAll(page, limit);

    const response: ApiResponse<Seed[]> = {
      data: result.data,
      pagination: result.pagination,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Create a new seed
   */
  static async createSeed(req: AuthRequest, res: Response) {
    const data = req.body as CreateSeedInput;

    const exists = await SeedService.findByName(data.name);
    if (exists) {
      const error: ApiError = {
        error: "Seed with this name already exists",
        status: HTTP_CONFLICT,
      };
      return res.status(HTTP_CONFLICT).json(error);
    }

    const seed = await SeedService.create(data);

    const response: ApiResponse<Seed> = {
      data: seed,
      status: HTTP_CREATED,
    };

    return res.status(HTTP_CREATED).json(response);
  }

  /**
   * Get seed by ID
   */
  static async getSeedById(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const error: ApiError = {
        error: "Invalid seed ID",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    const seed = await SeedService.findById(id, true);

    if (!seed) {
      const error: ApiError = {
        error: "Seed not found",
        status: HTTP_NOT_FOUND,
      };
      return res.status(HTTP_NOT_FOUND).json(error);
    }

    const response: ApiResponse<Seed | SeedWithFertilizers> = {
      data: seed,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Update seed information
   */
  static async updateSeed(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);
    const data = req.body as Partial<CreateSeedInput>;

    if (isNaN(id)) {
      const error: ApiError = {
        error: "Invalid seed ID",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    // Check if seed exists
    const exists = await SeedService.findById(id);
    if (!exists) {
      const error: ApiError = {
        error: "Seed not found",
        status: HTTP_NOT_FOUND,
      };
      return res.status(HTTP_NOT_FOUND).json(error);
    }

    const seed = await SeedService.update(id, data);

    const response: ApiResponse<Seed> = {
      data: seed,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Delete a seed
   */
  static async deleteSeed(req: AuthRequest, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const error: ApiError = {
        error: "Invalid seed ID",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    // Check if seed exists
    const exists = await SeedService.findById(id);
    if (!exists) {
      const error: ApiError = {
        error: "Seed not found",
        status: HTTP_NOT_FOUND,
      };
      return res.status(HTTP_NOT_FOUND).json(error);
    }

    const seed = await SeedService.delete(id);

    const response: ApiResponse<Seed> = {
      data: seed,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Get seeds compatible with specific fertilizer
   */
  static async getSeedsByFertilizer(req: AuthRequest, res: Response) {
    const fertilizerId = Number(req.params.fertilizerId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (isNaN(fertilizerId)) {
      const error: ApiError = {
        error: "Invalid fertilizer ID",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    const result = await SeedService.getSeedsByFertilizer(
      fertilizerId,
      page,
      limit,
    );

    const response: ApiResponse<SeedWithFertilizers[]> = {
      data: result.data,
      pagination: result.pagination,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Get all seeds with their compatible fertilizers
   */
  static async getAllSeedsWithFertilizers(req: AuthRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await SeedService.getAllSeedsWithFertilizers(page, limit);

    const response: ApiResponse<SeedWithFertilizers[]> = {
      data: result.data,
      pagination: result.pagination,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }
}
