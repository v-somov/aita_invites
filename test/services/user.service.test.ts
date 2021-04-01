import chai from "chai";
import * as factory from "../factory";
import { userService } from "../../src/services";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.use(sinonChai);

const expect = chai.expect;

describe("userService", () => {
  describe("latestArrivedUser", () => {
    context("when there no arrived users", () => {
      it("raises an error", async () => {
        return userService.latestArrivedUser().catch((error) => {
          expect(error.message).to.equal("No data returned from the query.");
        });
      });
    });

    context("when there are arrived users", () => {
      it("raises an error", async () => {
        const user = await factory.createUser(factory.defaultUser);
        await factory.createBoardingPass({
          status: "arrived",
          user_id: user.id,
          invite_code: "12345678",
        });

        const result = await userService.latestArrivedUser();
        expect(result).to.deep.equal({
          name: user.name,
          distance: user.distance,
          hours: user.hours,
        });
      });
    });
  });

  describe("arrivedUsers", async () => {
    context("when there are arrived user since timestamp", () => {
      it("returns array of users", async () => {
        const user = await factory.createUser(factory.defaultUser);
        const boardingPass = await factory.createBoardingPass({
          status: "arrived",
          user_id: user.id,
          invite_code: "12345678",
        });

        const user2 = await factory.createUser({
          name: "good user",
          distance: 10,
          hours: 10,
        });
        const boardingPass2 = await factory.createBoardingPass({
          status: "arrived",
          user_id: user2.id,
          invite_code: "1111111",
        });

        const result = await userService.arrivedUsers(boardingPass.updated_at);

        expect(result).to.deep.equal([
          {
            name: user2.name,
            distance: user2.distance,
            hours: user2.hours,
            boarding_pass_updated_at: boardingPass2.updated_at,
          },
        ]);
      });
    });

    context("when there are no arrived users since timestamp", () => {
      it("returns empty array", async () => {
        const user = await factory.createUser(factory.defaultUser);
        const boardingPass = await factory.createBoardingPass({
          status: "arrived",
          user_id: user.id,
          invite_code: "12345678",
        });

        const result = await userService.arrivedUsers(boardingPass.updated_at);

        expect(result).to.deep.equal([]);
      });
    });
  });
});
