import { Request, Response } from "express";
import FarmersService from "#api/farmers/farmers.service";
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from "#constants/httpStatus";
import { comparePassword } from "#/utils/auth";
import { generateTokens } from "#/utils/auth";

export default class FarmersController {
  /**
   * Get all farmers with pagination
   */
  static async getAllFarmers(req: Request, res: Response) {
    const { page, limit } = req.query;
    const farmers = await FarmersService.getAll(
      Number(page) || 1,
      Number(limit) || 5,
    );

    return res.status(HTTP_OK).json({
      ...farmers,
      status: HTTP_OK,
    });
  }

  /**
   * Create new farmer account
   */
  static async createAccount(req: Request, res: Response) {
    const { body } = req;

    const userExists = await FarmersService.findByPhone(body.phoneNumber);

    if (userExists) {
      return res.status(HTTP_CONFLICT).json({
        error: "User with the same phone number already exists",
        status: HTTP_CONFLICT,
      });
    }

    const newUser = await FarmersService.create(body);
    return res.status(HTTP_CREATED).json({
      data: newUser,
      status: HTTP_CREATED,
    });
  }

  /**
   * Login to farmer account
   */
  static async login(req: Request, res: Response) {
    const { body } = req;

    const userAccount = await FarmersService.findByPhone(body.phoneNumber);

    if (
      !userAccount ||
      !(await comparePassword(body.password, userAccount.passwordHash))
    ) {
      return res.status(HTTP_UNAUTHORIZED).json({
        error: "Invalid account credentials",
        status: HTTP_UNAUTHORIZED,
      });
    }

    const jwtToken = generateTokens({
      userId: userAccount.id,
      phoneNumber: userAccount.phoneNumber,
    });

    return res.status(HTTP_OK).json({
      data: jwtToken,
      status: HTTP_OK,
    });
  }
}
