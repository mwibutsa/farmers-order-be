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
 *     summary: Get all seeds
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of seeds
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
 *             $ref: "#/components/schemas/CreateSeedInput"
 *     responses:
 *       201:
 *         description: Created seed
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateSeedInput"
 *     responses:
 *       200:
 *         description: Updated seed
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
 *     responses:
 *       200:
 *         description: Deleted seed
 */
seedRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncErrorHandler(SeedController.deleteSeed),
);

export default seedRouter;
