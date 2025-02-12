import { CelebrateError } from "celebrate";
import { Request, Response, NextFunction } from "express";

const celebrateErrorHandler = (
  err: CelebrateError,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err && err.details) {
    const errorDetails = err.details.get("body") ?? err?.details.get("query");

    if (!errorDetails) {
      return next();
    }

    const {
      message,
      path: [keyName],
    } = errorDetails.details[0];
    return res.status(400).json({
      error: {
        [keyName]: message,
      },
    });
  }
  return next(err);
};

export default celebrateErrorHandler;
