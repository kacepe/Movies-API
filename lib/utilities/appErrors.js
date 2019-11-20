// eslint-disable-next-line max-classes-per-file
class AppError extends Error {
  constructor(name, message, statusCode) {
    super();
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}

global.AppError = AppError;

class BadRequest extends AppError {
  constructor(message) {
    super('Bad Request', message || 'You sent bad request.', 400);
  }
}
global.BadRequest = BadRequest;

class NotFound extends AppError {
  constructor(message) {
    super('Not Found', message || 'Resource not found.', 404);
  }
}
global.NotFound = NotFound;
