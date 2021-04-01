import db from "../db";
import { v4 as uuid } from "uuid";
import PDFDocument from "pdfkit";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

interface BoardingPassResponse {
  name: string;
  invite_code: string;
}

// For testing purposes it is allowed to create multiple board passes
// for the same user
export const generateBoardingPass = async (
  userId: number
): Promise<BoardingPassResponse> => {
  try {
    const inviteCode = generateInviteCode();
    const insert = await db.one(
      `insert into boarding_passes(invite_code, user_id, status)
         values($1, $2, $3) returning id`,
      [inviteCode, userId, "pending"]
    );
    return await db.one(
      `select users.name, boarding_passes.invite_code
         from boarding_passes
         join users on users.id = boarding_passes.user_id
         where boarding_passes.id = $1`,
      [insert.id]
    );
  } catch (_) {
    throw new Error("Failed to create boarding pass");
  }
};

export const generatePdfBoardingPass = async (
  userId: number
): Promise<Buffer> => {
  try {
    const data: BoardingPassResponse = await generateBoardingPass(userId);
    return await generatePdf(data);
  } catch (_) {
    throw new Error("Failed to generate boarding pass pdf");
  }
};

export const updateBoardingPass = async (
  inviteCode: string
): Promise<number> => {
  try {
    const result = await db.one(
      `update boarding_passes set status = 'arrived'
        where invite_code = $1 and status = 'pending'
        returning user_id`,
      [inviteCode]
    );
    return Promise.resolve(result.user_id);
  } catch {
    throw new Error("Boarding pass is invalid or already arrived!");
  }
};

export const generateInviteCode = (): string => {
  return uuid();
};

const generatePdf = async (payload: BoardingPassResponse): Promise<Buffer> => {
  return new Promise((resolve) => {
    const pdfDoc = new PDFDocument({ bufferPages: true });
    const buffers: Buffer[] = [];
    pdfDoc.on("data", buffers.push.bind(buffers));
    pdfDoc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    const [width, height] = [150, 50];
    const barcode = generateBarcode(payload.invite_code, width, height);

    pdfDoc.font("Times-Roman").fontSize(36).text("Boarding Pass");
    pdfDoc.font("Times-Roman").fontSize(24).text(payload.name);
    pdfDoc.image(barcode, 360, 70, { width: width, height: height });
    pdfDoc.end();
  });
};

const generateBarcode = (
  inviteCode: string,
  width: number,
  height: number
): string => {
  const canvas = createCanvas(width, height);

  JsBarcode(canvas, inviteCode, {
    format: "code39",
    flat: true,
  });

  return canvas.toDataURL("image/png");
};
