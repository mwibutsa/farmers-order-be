import { Request, Response } from "express";
import FarmersService from "#api/farmers/farmers.service";
import {
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from "#constants/httpStatus";
import { comparePassword } from "#/utils/auth";
import { generateTokens } from "../../utils/auth";

export default class FarmersController {
  static async getAllFarmers(_: Request, res: Response) {
    const farmers = await FarmersService.getAll();
    return res.status(HTTP_OK).json(farmers);
  }

  static async createAccount(req: Request, res: Response) {
    const { body } = req;

    // check if the phone number is not in use
    const userExists = await FarmersService.findByPhone(body.phoneNumber);

    if (userExists) {
      return res
        .status(HTTP_CONFLICT)
        .json({ error: "User with the same phone number already exist." });
    }
    const newUser = await FarmersService.create(body);
    return res.status(HTTP_CREATED).json(newUser);
  }

  static async login(req: Request, res: Response) {
    const { body } = req;

    const userAccount = await FarmersService.findByPhone(body.phoneNumber);

    // verify password
    if (
      !userAccount ||
      !(await comparePassword(body.password, userAccount.passwordHash))
    ) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: "Invalid account credentials" });
    }

    // generate auth token.
    const jwtToken = generateTokens({
      userId: userAccount.id,
      phoneNumber: userAccount.phoneNumber,
    });
    return res.status(HTTP_OK).json(jwtToken);
  }
}
