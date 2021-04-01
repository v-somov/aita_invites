import { HttpError } from "../errors";
import { NextFunction, Request, Response } from "express";
import { errorHandlerMiddleware } from "./error-handler";

const notFound = async (_req: Request, _res: Response): Promise<void> => {
  throw new HttpError("Not Found", 404);
};

const logger = (req: Request, _res: Response, next: () => void): void => {
  console.log(`[${req.method}] ${req.url}`);
  next();
};

export { notFound, errorHandlerMiddleware, logger };
