import chai from "chai";
import * as factory from "../factory";
import { boardingPassService } from "../../src/services";
import db from "../../src/db";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.use(sinonChai);

const expect = chai.expect;

describe("boardingPassService", () => {
  describe("generateBoardingPass", () => {
    context("when user with provided id exists", () => {
      it("creates boarding pass, returning id", async () => {
        const inviteCode = "12345678";
        const stub = sinon
          .stub(boardingPassService, "generateInviteCode")
          .returns(inviteCode);

        const user = await factory.createUser(factory.defaultUser);
        const result = await boardingPassService.generateBoardingPass(user.id);

        expect(result).to.deep.equal({
          name: "test",
          invite_code: inviteCode,
        });

        const dbResult = await db.one(
          "select invite_code, user_id, status from boarding_passes"
        );

        expect(dbResult).to.deep.equal({
          invite_code: inviteCode,
          user_id: user.id,
          status: "pending",
        });

        stub.restore();
      });
    });

    context("when user with provided id does not exist", () => {
      it("raises an error", async () => {
        return boardingPassService
          .generateBoardingPass(1)
          .catch((error) =>
            expect(error.message).to.be.eq("Failed to create boarding pass")
          );
      });
    });
  });

  describe("generatePdfBoardingPass", () => {
    context("when user with provided id exists", () => {
      it("creates boarding pass, returning id", async () => {
        const spy = sinon.spy(boardingPassService, "generateBoardingPass");

        const user = await factory.createUser(factory.defaultUser);
        await boardingPassService.generatePdfBoardingPass(user.id);

        expect(spy).to.be.calledWith(user.id);
      });
    });

    context("when user with provided id does not exist", () => {
      it("raises an error", async () => {
        return boardingPassService
          .generatePdfBoardingPass(1)
          .catch((error) =>
            expect(error.message).to.be.eq(
              "Failed to generate boarding pass pdf"
            )
          );
      });
    });
  });

  describe("updateBoardingPass", () => {
    context(
      "when boarding pass exists for invite code and status is pending",
      () => {
        it("sets boarding pass as arrived", async () => {
          const user = await factory.createUser(factory.defaultUser);
          const boardingPass = await factory.createBoardingPass({
            status: "pending",
            user_id: user.id,
            invite_code: "12345678",
          });
          await boardingPassService.updateBoardingPass(
            boardingPass.invite_code
          );
          const result: any = await db.one(
            `select status from boarding_passes where invite_code = $1`,
            [boardingPass.invite_code]
          );

          expect(result.status).to.equal("arrived");
        });
      }
    );

    context(
      "when boarding pass exists for invite code and status is arrived",
      () => {
        it("raises an error", async () => {
          const user = await factory.createUser(factory.defaultUser);
          const boardingPass = await factory.createBoardingPass({
            status: "arrived",
            user_id: user.id,
            invite_code: "12345678",
          });

          await expect(
            boardingPassService.updateBoardingPass(boardingPass.invite_code)
          ).to.be.rejectedWith("Boarding pass is invalid or already arrived!");
        });
      }
    );

    context("when boarding pass does not exists", () => {
      it("raises an error", async () => {
        await expect(
          boardingPassService.updateBoardingPass("12345678")
        ).to.be.rejectedWith("Boarding pass is invalid or already arrived!");
      });
    });
  });
});
