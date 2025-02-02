import { Response } from "express";
import { AuthRequest, OrderWithFullDetails } from "#/interfaces/models";
import OrderService from "./order.service";
import {
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_BAD_REQUEST,
} from "#/constants/httpStatus";
import { OrderStatus } from "@prisma/client";
import { OrderWithDetails } from "#/interfaces/models";
import { ApiResponse, ApiError } from "#/interfaces/request";

export default class OrderController {
  /**
   * Create a new order
   */
  static async createOrder(req: AuthRequest, res: Response) {
    const order = await OrderService.create(
      req.user?.userId as number,
      req.body,
    );

    const response: ApiResponse<OrderWithDetails> = {
      data: order,
      status: HTTP_CREATED,
    };

    return res.status(HTTP_CREATED).json(response);
  }

  /**
   * Get farmer's orders with pagination
   */
  static async getFarmerOrders(req: AuthRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await OrderService.getFarmerOrders(
      req.user?.userId as number,
      page,
      limit,
    );

    const response: ApiResponse<OrderWithDetails[]> = {
      data: result.data,
      pagination: result.pagination,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Get all pending orders with pagination
   */
  static async getPendingOrders(req: AuthRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await OrderService.getAllPendingOrders(page, limit);

    const response: ApiResponse<OrderWithFullDetails[]> = {
      data: result.data,
      pagination: result.pagination,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(req: AuthRequest, res: Response) {
    const orderId = Number(req.params.id);
    const status = req.body.status as OrderStatus;

    if (!orderId || !status) {
      const error: ApiError = {
        error: "Order ID and status are required",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    const orderExist = await OrderService.getOrderById(orderId);

    if (!orderExist) {
      const error: ApiError = {
        error: "No order with the provided ID was found",
        status: HTTP_NOT_FOUND,
      };
      return res.status(HTTP_NOT_FOUND).json(error);
    }

    const order = await OrderService.updateOrderStatus(orderId, status);

    const response: ApiResponse<OrderWithDetails> = {
      data: order,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }

  /**
   * Get order by ID
   */
  static async getOrderById(req: AuthRequest, res: Response) {
    const orderId = Number(req.params.id);

    if (!orderId) {
      const error: ApiError = {
        error: "Valid order ID is required",
        status: HTTP_BAD_REQUEST,
      };
      return res.status(HTTP_BAD_REQUEST).json(error);
    }

    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      const error: ApiError = {
        error: "No order with the provided ID was found",
        status: HTTP_NOT_FOUND,
      };
      return res.status(HTTP_NOT_FOUND).json(error);
    }

    const response: ApiResponse<OrderWithFullDetails> = {
      data: order,
      status: HTTP_OK,
    };

    return res.status(HTTP_OK).json(response);
  }
}
