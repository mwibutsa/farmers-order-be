import { Response } from "express";
import { HTTP_CONFLICT, HTTP_CREATED, HTTP_OK } from "#/constants/httpStatus";
import LandService from "./land.service";
import { AuthRequest } from "#/interfaces/models";

export default class LandController {
  static async getFarmersLands(req: AuthRequest, res: Response) {
    const { page = 1, limit = 5 } = req.query;

    const lands = await LandService.getFarmersLands(
      req.user?.userId as number,
      +page,
      +limit,
    );
    return res.status(HTTP_OK).json({
      status: HTTP_OK,
      data: lands,
    });
  }

  static async addLandInfo(req: AuthRequest, res: Response) {
    const { body } = req;

    const landExists = await LandService.findLandByUpi(body.upi);

    if (landExists) {
      return res.status(HTTP_CONFLICT).json({
        error: "Land with the same UPI already exists",
      });
    }

    const newLand = await LandService.addLandInfo({
      farmerId: req.user?.userId as number,
      ...body,
    });

    return res.status(HTTP_CREATED).json({
      data: newLand,
      status: HTTP_CREATED,
    });
  }
}
