import { Request, Response } from "express";
import FarmersService from "./farmers.service";
import { HTTP_CONFLICT, HTTP_CREATED, HTTP_OK } from "@/constants/httpStatus";
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
    const newUser = FarmersService.create(body);
    return res.status(HTTP_CREATED).json(newUser);
  }
}
