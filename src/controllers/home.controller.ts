import { Request, Response } from "express";

const indexHome = async (_: Request, res: Response) => {
  res.render("home/index", {});
};

export { indexHome };
