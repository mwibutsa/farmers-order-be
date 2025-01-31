import { Router } from "express";
import OrderController from "./order.controller";
import { asyncErrorHandler } from "#middleware/errorHandler";
import {
  authenticateToken,
  authenticateAdmin,
} from "#middleware/auth.middleware";
import * as validations from "./order.validation";

const orderRouter = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateOrderInput"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
orderRouter.post(
  "/",
  authenticateToken,
  validations.createOrderSchema,
  asyncErrorHandler(OrderController.createOrder),
);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get authenticated farmer's orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of farmer's orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
orderRouter.get(
  "/my-orders",
  authenticateToken,
  asyncErrorHandler(OrderController.getFarmerOrders),
);

/**
 * @swagger
 * /orders/pending:
 *   get:
 *     tags: [Orders]
 *     summary: Get all pending orders (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
orderRouter.get(
  "/pending",
  authenticateAdmin,
  asyncErrorHandler(OrderController.getPendingOrders),
);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateOrderStatusInput"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
orderRouter.put(
  "/:id/status",
  authenticateAdmin,
  validations.updateOrderStatusSchema,
  asyncErrorHandler(OrderController.updateOrderStatus),
);

export default orderRouter;
