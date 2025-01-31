import { Router } from "express";
import SeedController from "./seed.controller";
import { asyncErrorHandler } from "#middleware/errorHandler";
import { authenticateAdmin } from "#middleware/auth.middleware";
import * as validations from "./seed.validation";

const seedRouter = Router();

/**
 * @swagger
 * /seeds:
 *   get:
 *     tags: [Seeds]
 *     summary: Get all seeds with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of seeds per page
 *     responses:
 *       200:
 *         description: List of seeds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedsResponse'
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
seedRouter.get("/", asyncErrorHandler(SeedController.getAllSeeds));

/**
 * @swagger
 * /seeds:
 *   post:
 *     tags: [Seeds]
 *     summary: Create new seed
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SeedInput"
 *     responses:
 *       201:
 *         description: Created seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
seedRouter.post(
  "/",
  authenticateAdmin,
  validations.createSeedSchema,
  asyncErrorHandler(SeedController.createSeed),
);

/**
 * @swagger
 * /seeds/{id}:
 *   put:
 *     tags: [Seeds]
 *     summary: Update seed
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Seed ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SeedInput"
 *     responses:
 *       200:
 *         description: Updated seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Seed not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
seedRouter.put(
  "/:id",
  authenticateAdmin,
  validations.updateSeedSchema,
  asyncErrorHandler(SeedController.updateSeed),
);

/**
 * @swagger
 * /seeds/{id}:
 *   delete:
 *     tags: [Seeds]
 *     summary: Delete seed
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Seed ID
 *     responses:
 *       200:
 *         description: Successfully deleted seed
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Seed not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
seedRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncErrorHandler(SeedController.deleteSeed),
);

export default seedRouter;
