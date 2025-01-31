import { HTTP_BAD_REQUEST } from "#/constants/httpStatus";
import { AuthRequest } from "#/interfaces/models";
import { DatabaseError } from "#/lib/errors";
import { NextFunction, Request, Response } from "express";

export const asyncErrorHandler = (
  callback: (
    req: AuthRequest,
    res: Response,
    next?: NextFunction,
  ) => Promise<Response>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
      return next();
    } catch (error) {
      if (error instanceof DatabaseError && error.isClientError) {
        return res.status(HTTP_BAD_REQUEST).json({
          error: error.message,
        });
      }
      return res.status(500).json({ error: (error as Error).message });
    }
  };
};
