import { Router } from "express";
import FarmersController from "./farmers.controller";
import { asyncErrorHandler } from "@/middleware/errorHandler";

const farmersRouter = Router();

/**
 * @swagger
 * /farmers/all:
 *   get:
 *     tags: [Farmers]
 *     summary: Get all farmers
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Farmers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmersResponse'
 *       500:
 *         description: Internal server error
 */
farmersRouter.get(
  "/all-farmers",
  asyncErrorHandler(FarmersController.getAllFarmers),
);

/**
 * @swagger
 * /farmers/sign-up:
 *   put:
 *     tags: [Farmers]
 *     summary: Create Farmer account
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/FarmerInput"
 *     responses:
 *       201:
 *         description: Returns the new created farmer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerResponse'
 *       400:
 *         description: Invalid request body
 *         schema:
 *           $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/components/schemas/ServerError'
 */
farmersRouter.post("/create-account");

export default farmersRouter;
