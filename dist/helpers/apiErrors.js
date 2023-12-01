"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.ForbiddenError = exports.NotFoundError = exports.BadRequestError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
class BadRequestError extends ApiError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ApiError {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'Forbidden', 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : 'Unauthorized', 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=apiErrors.js.map