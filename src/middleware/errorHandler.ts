import { NextFunction, Request, Response } from "express";

export const asyncErrorHandler = (
  callback: (
    req: Request,
    res: Response,
    next?: NextFunction,
  ) => Promise<Response>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
      return next();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
};
