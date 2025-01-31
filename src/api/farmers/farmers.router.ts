import { Router } from "express";
import FarmersController from "./farmers.controller";
import { asyncErrorHandler } from "#middleware/errorHandler";
import * as validations from "./farmers.validation";

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
 *   post:
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
farmersRouter.post(
  "/sign-up",
  validations.signUpSchema,
  asyncErrorHandler(FarmersController.createAccount),
);

/**
 * @swagger
 * /farmers/login:
 *   post:
 *     tags: [Farmers]
 *     summary: Log into Farmer account
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/LoginInput"
 *     responses:
 *       201:
 *         description: Returns the jwt token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Invalid request body
 *         schema:
 *           $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/components/schemas/ServerError'
 */
farmersRouter.post(
  "/login",
  validations.loginSchema,
  asyncErrorHandler(FarmersController.login),
);
export default farmersRouter;
