import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";

const errorHandlerMiddleware = (
  err: HttpError,
  _: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
};

export { errorHandlerMiddleware };
