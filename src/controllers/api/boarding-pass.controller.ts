import { NextFunction, Request, Response } from "express";
import db from "../../db";
import { HttpError } from "../../errors";
import { boardingPassService } from "../../services";

const createBoardingPass = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const ext = req.params.ext;
    if (ext == "pdf") {
      const pdfData = await boardingPassService.generatePdfBoardingPass(userId);
      res
        .writeHead(200, {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-disposition": `attachment;filename=${userId}.pdf`,
        })
        .end(pdfData);
    } else {
      const data = await boardingPassService.generateBoardingPass(userId);
      res.status(200).json({
        data: data,
      });
    }
  } catch (e) {
    const err = new HttpError(e.message, 400);
    next(err);
  }
};

const updateBoardingPass = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inviteCode = req.params.invite_code;
    const userId = await boardingPassService.updateBoardingPass(inviteCode);

    const io = req.app.get("io");
    io.emit(
      "userArrived",
      await db.one(`select * from users where id = $1`, [userId])
    );

    res.status(200).json({
      data: { user_id: userId },
    });
  } catch (e) {
    next(new HttpError(e.message, 404));
  }
};

export { createBoardingPass, updateBoardingPass };
