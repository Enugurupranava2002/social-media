exports.throwError = (message, statusCode, errors) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (errors && errors.array && errors.array().length > 0) {
    error.data = errors.array();
  }
  throw error;
};
