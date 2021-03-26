import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";

const errorHandlerMiddleware = (
  error: HttpError,
  _: Request,
  res: Response
) => ApplicationR{
  res.status(error.status || 500).json({
    status: "error",
    message: error.message
  });
};

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  const err = new HttpError("Not Found", 404);
  next(err);
};

export { errorHandlerMiddleware, notFound };
