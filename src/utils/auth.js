const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const { throwError } = require("./error");

exports.auth = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors && !errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    if (!req.headers || !req.headers.authorization) {
      throwError("Authorization is required", 422, errors);
    }

    if (!req.headers.authorization.startsWith("Bearer ")) {
      throwError(
        "Authorization header need to start with 'Bearer '",
        422,
        errors
      );
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    if (!accessToken) {
      throwError("Access Token is required", 422, errors);
    }

    req.accessToken = accessToken;
    req.userId = jwt.verify(
      req.accessToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          throwError("Token expired!", 401, errors);
        }
        return decoded;
      }
    ).userId;

    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
