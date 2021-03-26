import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /", () => {
  it("should render home view", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
