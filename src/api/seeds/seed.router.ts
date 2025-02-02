import { Router } from "express";
import SeedController from "./seed.controller";
import { asyncErrorHandler } from "#middleware/errorHandler";
import { authenticateAdmin } from "#middleware/auth.middleware";
import * as validations from "./seed.validation";

const seedRouter = Router();

/**
 * @swagger
 * /seeds/fertilizer/{fertilizerId}:
 *   get:
 *     tags: [Seeds]
 *     summary: Get compatible seeds for fertilizer
 *     description: Get all seeds that are compatible with a specific fertilizer
 *     parameters:
 *       - in: path
 *         name: fertilizerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Fertilizer ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of seeds per page
 *     responses:
 *       200:
 *         description: List of compatible seeds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedsWithFertilizersResponse'
 *       400:
 *         description: Invalid fertilizer ID or pagination parameters
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
seedRouter.get(
  "/fertilizer/:fertilizerId",
  asyncErrorHandler(SeedController.getSeedsByFertilizer),
);

/**
 * @swagger
 * /seeds/with-fertilizers:
 *   get:
 *     tags: [Seeds]
 *     summary: Get all seeds with fertilizer information
 *     description: Get a paginated list of all seeds with their compatible fertilizers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of seeds per page
 *     responses:
 *       200:
 *         description: List of seeds with fertilizer information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedsWithFertilizersResponse'
 *       400:
 *         description: Invalid pagination parameters
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
seedRouter.get(
  "/with-fertilizers",
  asyncErrorHandler(SeedController.getAllSeedsWithFertilizers),
);

/**
 * @swagger
 * /seeds/{id}:
 *   get:
 *     tags: [Seeds]
 *     summary: Get seed by ID
 *     description: Retrieve detailed information about a specific seed including compatible fertilizers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seed ID
 *     responses:
 *       200:
 *         description: Detailed seed information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedWithFertilizersResponse'
 *       404:
 *         description: Seed not found
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
seedRouter.get("/:id", asyncErrorHandler(SeedController.getSeedById));

/**
 * @swagger
 * /seeds:
 *   get:
 *     tags: [Seeds]
 *     summary: Get all seeds
 *     description: Retrieve a paginated list of all seeds
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 5
 *         description: Number of seeds per page
 *     responses:
 *       200:
 *         description: List of seeds  info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedsResponse'
 *       400:
 *         description: Invalid pagination parameters
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
seedRouter.get("/", asyncErrorHandler(SeedController.getAllSeeds));
/**
 * @swagger
 * /seeds:
 *   post:
 *     tags: [Seeds]
 *     summary: Create new seed
 *     description: Create a new seed with optional fertilizer compatibility (Admin only)
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
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Admin access required
 *       409:
 *         description: Seed with this name already exists
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
 *     description: Update seed information and fertilizer compatibility (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seed ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateSeedInput"
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
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Seed not found
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
 *     description: Delete a seed and its fertilizer compatibility records (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seed ID
 *     responses:
 *       200:
 *         description: Successfully deleted seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Seed not found
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
seedRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncErrorHandler(SeedController.deleteSeed),
);

export default seedRouter;
