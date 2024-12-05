class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Clean stack trace
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
    this.errors = "BAD_REQUEST";
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
