import { Router } from "express";
import LandController from "./land.controller";
import { asyncErrorHandler } from "#/middleware/errorHandler";
import * as validations from "./land.validation";
import { authenticateToken } from "#/middleware/auth.middleware";

const landsRouter = Router();

/**
 * @swagger
 * /land/farmers-land:
 *   get:
 *     tags: [Lands]
 *     summary: Get  farmer's lands
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
 *         description: Farmer's lands
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandsResponse'
 *       500:
 *         description: Internal server error
 */
landsRouter.get(
  "/farmers-land",
  authenticateToken,
  asyncErrorHandler(LandController.getFarmersLands),
);

/**
 * @swagger
 * /land/add-land-info:
 *   post:
 *     tags: [Lands]
 *     summary: Add land info
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/LandInput"
 *     responses:
 *       201:
 *         description: Returns the newly added land
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandResponse'
 *       400:
 *         description: Invalid request body
 *         schema:
 *           $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/components/schemas/ServerError'
 */
landsRouter.post(
  "/add-land-info",
  authenticateToken,
  validations.validateNewLandInfo,
  asyncErrorHandler(LandController.addLandInfo),
);

export default landsRouter;
