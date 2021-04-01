import { NextFunction, Request, Response } from "express";
import db from "../../db";
import { HttpError } from "../../errors";
import { body, validationResult } from "express-validator";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }

    const { name, distance, hours } = req.body.data;
    const user = await db.one(
      `insert into users(name, distance, hours) values ($1, $2, $3) returning *`,
      [name, distance, hours]
    );
    res.status(200).json(user);
  } catch (e) {
    const err = new HttpError(e.message, 400);
    next(err);
  }
};

export const validate = (method: string) => {
  switch (method) {
    case "createUser": {
      return [
        body("data.name", "name doesn't exists").exists().isString(),
        body("data.distance").exists().isInt(),
        body("data.hours").exists().isInt(),
      ];
    }
  }
};
