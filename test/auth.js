const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const { auth } = require("../src/utils/auth");

describe("Auth Controllers", function () {
  it("should throw an error if request validation is failed", function (done) {
    const req = {
      headers: null,
    };

    let message;
    let statusCode;

    const catchError = (e) => {
      message = e.message;
      statusCode = e.statusCode;
      return;
    };

    auth(req, {}, catchError)
      .then(function () {
        expect(message).to.be.equal("Authorization is required");
        expect(statusCode).to.be.equal(422);
        done();
      })
      .catch((e) => {
        console.log(e);
        done(new Error(e.message || "Error occured"));
      });
  });

  it("should throw an error if token is invalid", function (done) {
    const req = {
      headers: { authorization: "abc" },
    };

    let message;
    let statusCode;

    const catchError = (e) => {
      message = e.message;
      statusCode = e.statusCode;
      return;
    };

    auth(req, {}, catchError)
      .then(function () {
        expect(message).to.be.equal(
          "Authorization header need to start with 'Bearer '"
        );
        expect(statusCode).to.be.equal(422);
        done();
      })
      .catch((e) => {
        console.log(e);
        done(new Error(e.message || "Error occured"));
      });
  });

  it("should throw an error if token is not there", function (done) {
    const req = {
      headers: { authorization: "Bearer " },
    };

    let message;
    let statusCode;

    const catchError = (e) => {
      message = e.message;
      statusCode = e.statusCode;
      return;
    };

    auth(req, {}, catchError)
      .then(function () {
        expect(message).to.be.equal("Access Token is required");
        expect(statusCode).to.be.equal(422);
        done();
      })
      .catch((e) => {
        console.log(e);
        done(new Error(e.message || "Error occured"));
      });
  });

  it("should yeild a userId after decoding token", function (done) {
    const req = {
      headers: { authorization: "Bearer randomToken" },
    };

    // stubbing jwt.verify
    sinon.stub(jwt, "verify");
    // setting up the return value of jwt.verify
    jwt.verify.returns({ userId: "abc" });

    auth(req, {}, () => {})
      .then(function () {
        expect(req).to.have.property("userId");
        expect(req).to.have.property("userId", "abc");
        expect(jwt.verify.called).to.be.true;

        // restoring jwt.verify
        jwt.verify.restore();
        done();
      })
      .catch((e) => {
        console.log(e);
        done(new Error(e.message || "Error occured"));
      });
  });
});
