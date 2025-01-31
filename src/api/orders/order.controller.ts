import { Response } from "express";
import { AuthRequest } from "#/interfaces/models";
import OrderService from "./order.service";
import { HTTP_CREATED, HTTP_NOT_FOUND, HTTP_OK } from "#/constants/httpStatus";

export default class OrderController {
  static async createOrder(req: AuthRequest, res: Response) {
    const order = await OrderService.create(
      req.user?.userId as number,
      req.body,
    );
    return res.status(HTTP_CREATED).json({ data: order });
  }

  static async getFarmerOrders(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const orders = await OrderService.getFarmerOrders(
      req.user?.userId as number,
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json({ data: orders });
  }

  static async getPendingOrders(req: AuthRequest, res: Response) {
    const { page, limit } = req.query;
    const orders = await OrderService.getAllPendingOrders(
      Number(page) || 1,
      Number(limit) || 5,
    );
    return res.status(HTTP_OK).json({ data: orders });
  }

  static async updateOrderStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const orderExist = await OrderService.getOrderById(+id);

    if (!orderExist) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ error: "No order with the provided ID was found." });
    }

    const order = await OrderService.updateOrderStatus(Number(id), status);
    return res.status(HTTP_OK).json({ data: order });
  }
}
