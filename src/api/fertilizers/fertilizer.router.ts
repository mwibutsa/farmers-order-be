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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Fertilizers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/FertilizerResponse'
 *       500:
 *         description: Internal server error
 */
fertilizerRouter.get(
  "/",
  asyncErrorHandler(FertilizerController.getAllFertilizers),
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
 *     responses:
 *       200:
 *         description: Fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       500:
 *         description: Internal server error
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
 *     responses:
 *       201:
 *         description: Created fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       500:
 *         description: Internal server error
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
 *     responses:
 *       200:
 *         description: Updated Fertilizer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FertilizerResponse'
 *       500:
 *         description: Internal server error
 *
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
 *     responses:
 *       200:
 *         description: Deleted fertilizer
 */
fertilizerRouter.delete(
  "/:id",
  authenticateAdmin,
  asyncErrorHandler(FertilizerController.deleteFertilizer),
);

export default fertilizerRouter;
