class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Default status code
  error.statusCode = err.statusCode || 500;

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
    error = new ErrorHandler(message, 400);
  }

  // JWT invalid error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please login again.";
    error = new ErrorHandler(message, 401);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "Token expired. Please login again.";
    error = new ErrorHandler(message, 401);
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default ErrorHandler;
