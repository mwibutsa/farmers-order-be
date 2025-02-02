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
 *         schema:
 *           type: number
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page (default is 5)
 *     responses:
 *       200:
 *         description: List of farmers with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmersResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFarmerInput"
 *     responses:
 *       201:
 *         description: Returns the newly created farmer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FarmerResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User with this phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInput"
 *     responses:
 *       200:
 *         description: Returns the JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
farmersRouter.post(
  "/login",
  validations.loginSchema,
  asyncErrorHandler(FarmersController.login),
);

export default farmersRouter;
