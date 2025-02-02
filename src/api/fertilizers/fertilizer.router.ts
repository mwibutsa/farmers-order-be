import { Router } from "express";
import FertilizerController from "./fertilizer.controller";
import { asyncErrorHandler } from "#middleware/errorHandler";
import { authenticateAdmin } from "#middleware/auth.middleware";
import * as validations from "./fertilizer.validation";

const fertilizerRouter = Router();

/**
 * @swagger
 * /fertilizers:
 *   get:
 *     tags: [Fertilizers]
 *     summary: Get all fertilizers
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
 *         description: List of fertilizers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedFertilizerResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
fertilizerRouter.get(
  "/",
  asyncErrorHandler(FertilizerController.getAllFertilizers),
);

/**
 * @swagger
 * /fertilizers/with-seeds:
 *   get:
 *     tags: [Fertilizers]
 *     summary: Get all fertilizers with their compatible seeds
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
 *         description: List of fertilizers with their compatible seeds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedFertilizerResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
fertilizerRouter.get(
  "/with-seeds",
  asyncErrorHandler(FertilizerController.getAllFertilizersWithSeeds),
);

/**
 * @swagger
 * /fertilizers/by-seed/{seedId}:
 *   get:
 *     tags: [Fertilizers]
 *     summary: Get fertilizers compatible with a specific seed
 *     parameters:
 *       - in: path
 *         name: seedId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the seed
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
 *         description: List of compatible fertilizers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedFertilizerResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
fertilizerRouter.get(
  "/by-seed/:seedId",
  asyncErrorHandler(FertilizerController.getFertilizersBySeed),
);

/**
 * @swagger
 * /fertilizers/{id}:
 *   get:
 *     tags: [Fertilizers]
 *     summary: Get a specific fertilizer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Fertilizer ID
 *     responses:
 *       200:
 *         description: Fertilizer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       404:
 *         description: Fertilizer not found
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
fertilizerRouter.get(
  "/:id",
  asyncErrorHandler(FertilizerController.getFertilizer),
);

/**
 * @swagger
 * /fertilizers:
 *   post:
 *     tags: [Fertilizers]
 *     summary: Create new fertilizer (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFertilizerInput'
 *     responses:
 *       201:
 *         description: Created fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Fertilizer with this name already exists
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
fertilizerRouter.post(
  "/",
  authenticateAdmin,
  validations.createFertilizerSchema,
  asyncErrorHandler(FertilizerController.createFertilizer),
);

/**
 * @swagger
 * /fertilizers/{id}:
 *   put:
 *     tags: [Fertilizers]
 *     summary: Update fertilizer (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Fertilizer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFertilizerInput'
 *     responses:
 *       200:
 *         description: Updated Fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       404:
 *         description: Fertilizer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Fertilizer with this name already exists
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
fertilizerRouter.put(
  "/:id",
  authenticateAdmin,
  validations.updateFertilizerSchema,
  asyncErrorHandler(FertilizerController.updateFertilizer),
);

/**
 * @swagger
 * /fertilizers/{id}:
 *   delete:
 *     tags: [Fertilizers]
 *     summary: Delete fertilizer (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Fertilizer ID
 *     responses:
 *       200:
 *         description: Deleted fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       404:
 *         description: Fertilizer not found
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
fertilizerRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncErrorHandler(FertilizerController.deleteFertilizer),
);

export default fertilizerRouter;
