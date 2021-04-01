import chai from "chai";
import chaiHttp from "chai-http";
import { createServer, Server as HttpServer } from "http";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { Server, Socket } from "socket.io";
import { app } from "../../../src/app";
import * as factory from "../../factory";
import { AddressInfo } from "node:net";
import { User } from "../../../src/models";
import { boardingPassService } from "../../../src/services";
import sinon from "sinon";
import db from "../../../src/db";

chai.use(chaiHttp);
const expect = chai.expect;

describe("BoardingPassController", () => {
  let io: Server,
    httpServer: HttpServer,
    serverSocket: Socket,
    clientSocket: ClientSocket;

  before((done) => {
    httpServer = createServer(app);
    io = new Server(httpServer);
    app.set("io", io);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.close();
  });

  describe("POST /api/users/:id/boarding_passes", () => {
    context("when user does not exists", () => {
      it("returns error response", (done) => {
        chai
          .request(httpServer)
          .post("/api/users/1/boarding_passes")
          .end((_, res) => {
            expect(res.status).to.be.eq(400);
            expect(res.body).to.deep.equal({
              status: 400,
              message: "Failed to create boarding pass",
            });
            done();
          });
      });
    });

    context("when user exists", () => {
      it("creates new boarding pass", async () => {
        const inviteCode = "12345678";
        const stub = sinon
          .stub(boardingPassService, "generateInviteCode")
          .returns(inviteCode);

        const user = await factory.createUser(factory.defaultUser);

        const res = await chai
          .request(httpServer)
          .post("/api/users/" + user.id + "/boarding_passes");

        expect(
          await db.one("select * from boarding_passes limit 1;")
        ).to.include({
          status: "pending",
          user_id: user.id,
          invite_code: inviteCode,
        });

        expect(res.status).to.be.eq(200);
        expect(res.body).to.deep.equal({
          data: {
            name: user.name,
            invite_code: inviteCode,
          },
        });

        stub.restore();
      });
    });
  });

  describe("PUT /api/boarding_passes/:invite_code", () => {
    context("when user does not exists", () => {
      it("returns error response", (done) => {
        chai
          .request(httpServer)
          .put("/api/boarding_passes/1")
          .end((_, res) => {
            expect(res.status).to.be.eq(404);
            expect(res.body).to.deep.equal({
              status: 404,
              message: "Boarding pass is invalid or already arrived!",
            });
            done();
          });
      });
    });

    context("when boarding pass exits", () => {
      let user: User;

      beforeEach(async () => {
        user = await factory.createUser(factory.defaultUser);
        await factory.createBoardingPass({
          status: "pending",
          user_id: user.id,
          invite_code: "12345678",
        });
      });

      it("updates boarding pass and returns corresponding user_id", async () => {
        const res = await chai
          .request(httpServer)
          .put("/api/boarding_passes/12345678");

        expect(res.status).to.be.eq(200);
        expect(res.body).to.deep.equal({
          data: { user_id: user.id },
        });
      });

      it("send to userArrived channel message with new user", (done) => {
        clientSocket.on("userArrived", (arg) => {
          expect(arg).to.have.all.keys(
            "id",
            "name",
            "distance",
            "hours",
            "created_at",
            "updated_at"
          );
          expect(arg).to.include({
            name: user.name,
            distance: user.distance,
            hours: user.hours,
          });
          done();
        });

        chai
          .request(httpServer)
          .put("/api/boarding_passes/12345678")
          .end((_, res) => {});
      });
    });
  });
});
