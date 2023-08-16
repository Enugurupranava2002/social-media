const { validationResult } = require("express-validator");

const { throwError } = require("./error");

exports.validateAuthRequest = (req) => {
  const errors = validationResult(req);

  if (errors && !errors.isEmpty()) {
    throwError("Validation failed", 422, errors);
  }

  if (!req.body.email) {
    throwError("Email is required", 422, errors);
  }

  if (req.body.email.indexOf("@") === -1) {
    throwError("Email must be valid", 422, errors);
  }

  if (!req.body.password) {
    throwError("Password is required", 422, errors);
  }

  if (req.body.password.length < 8 || req.body.password.length > 100) {
    throwError(
      "Password must be between 8 and 100 characters long",
      422,
      errors
    );
  }
};

exports.validatePostRequest = (req) => {
  const errors = validationResult(req);

  if (errors && !errors.isEmpty()) {
    throwError("Validation failed", 422, errors);
  }

  if (!req.body.title) {
    throwError("Title is required", 422, errors);
  }

  if (req.body.title.length < 5) {
    throwError("Title must be at least 5 characters long", 422, errors);
  }

  if (!req.body.description) {
    throwError("Description is required", 422, errors);
  }

  if (req.body.description.length == 0) {
    throwError("Description Should not be empty", 422, errors);
  }
};

exports.validateRequestIdParam = (req) => {
  const errors = validationResult(req);

  if (errors && !errors.isEmpty()) {
    throwError("Validation failed", 422, errors);
  }

  if (!req.params || !req.params.id) {
    throwError("Invalid URL", 422, errors);
  }
};

exports.validateCommentRequest = (req) => {
  const errors = validationResult(req);

  if (errors && !errors.isEmpty()) {
    throwError("Validation failed", 422, errors);
  }

  if (!req.params || !req.params.id) {
    throwError("Invalid URL", 422, errors);
  }

  if (!req.body || !req.body.comment || req.body.comment.length == 0) {
    throwError("Comment is required", 422, errors);
  }
};
