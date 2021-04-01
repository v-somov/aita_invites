import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app";
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";
import * as factory from "../factory";
import { User } from "../../src/models";

chai.use(chaiHttp);
const expect = chai.expect;

describe("HomeController", () => {
  let io: Server, httpServer: HttpServer;

  before((done) => {
    httpServer = createServer(app);
    io = new Server(httpServer);
    app.set("io", io);
    httpServer.listen(done);
  });

  after(() => {
    io.close();
  });

  describe("GET /", () => {
    it("should render home view", (done) => {
      chai
        .request(httpServer)
        .get("/")
        .end((_, res) => {
          expect(res.status).to.be.eq(200);
          expect(res.text).to.include("Map");
          expect(res.text).to.include("Boarding");
          done();
        });
    });
  });

  // better be properly tested with feature specs
  // same goes for map page
  describe("GET /boarding", () => {
    let user: User;

    beforeEach(async () => {
      user = await factory.createUser(factory.defaultUser);
      await factory.createBoardingPass({
        status: "arrived",
        user_id: user.id,
        invite_code: "12345678",
      });
    });

    it("should render boarding view", async () => {
      const res = await chai.request(httpServer).get("/boarding");

      expect(res.status).to.be.eq(200);
      expect(res.text).to.include(user.name);
      expect(res.text).to.include(user.distance);
      expect(res.text).to.include(user.hours);
    });
  });
});
