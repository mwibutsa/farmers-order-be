import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

import { extractTokenFromHeader, verifyToken, TokenError } from "../utils/auth";
import { AuthRequest } from "#/interfaces/models";
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED } from "#/constants/httpStatus";
import { StoreAdmin } from "#/models";

/**
 * Middleware to validate request data against a Zod schema
 */
export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Invalid request data",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const payload = verifyToken(token);
    req.user = payload;

    return next();
  } catch (error) {
    if (error instanceof TokenError) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
    next(error);
  }
};

export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(HTTP_UNAUTHORIZED).json({
        error: "Authentication required",
      });
    }

    const payload = verifyToken(token);
    const admin = await StoreAdmin.findUnique({
      where: { id: payload.userId },
    });

    if (!admin) {
      return res.status(HTTP_FORBIDDEN).json({
        error: "Admin access required",
      });
    }

    req.user = payload;
    return next();
  } catch (error) {
    if (error instanceof TokenError) {
      return res.status(HTTP_UNAUTHORIZED).json({
        error: error.message,
      });
    }
    next(error);
  }
};
