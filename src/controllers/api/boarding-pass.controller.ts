import * as express from "express";
import { Request, Response } from "express";
import IControllerBase from "../../../interfaces/IControllerBase.interface";
import db from "../../../db";
import { v4 as uuid } from "uuid";

class BoardingPassController implements IControllerBase {
  public path = "/api/boarding_pass";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path + "/:id", this.show);
    this.router.post("/api/users/:id/boarding_pass", this.create);
    this.router.put("/api/boarding_pass/:invite_code", this.update);
  }

  show = async (req: Request, res: Response, next) => {
    db.one(
      "select name, distance, hours from users where id = $1",
      req.params.id
    )
      .then(data => {
        res.status(200).json({
          data: data
        });
      })
      .catch(next);
  };

  create = async (req: Request, res: Response, next) => {
    const userId = req.params.id;
    try {
      const insert = await db.one(
        `insert into boarding_passes(invite_code, user_id, status)
         values($1, $2, $3) returning id`,
        [uuid(), userId, "pending"]
      );
      const data = await db.one(
        `select users.name, boarding_passes.invite_code
         from boarding_passes
         join users on users.id = boarding_passes.user_id
         where boarding_passes.id = $1`,
        [insert.id]
      );

      res.status(200).json({
        data: data
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next) => {
    const inviteCode = req.params.invite_code;
    try {
      const result = await db.one(
        `update boarding_passes set status = 'arrived'
         where invite_code = $1 and status = 'pending'
         returning user_id`,
        [inviteCode]
      );
      res.status(200).json({
        data: result
      });
    } catch (error) {
      console.log(error);
      next(error);
      // next(new BadRequestError("boarding pass is invalid!"));
    }
  };
}

export default BoardingPassController;
