import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../../../src/server";

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /boarding_pass/:id", () => {
  it("should return user", done => {
    chai
      .request(app)
      .get("/boarding_pass/1")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal({});
        done();
      });
  });
});

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      expect(process.env.NODE_ENV).to.equal("test");
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
