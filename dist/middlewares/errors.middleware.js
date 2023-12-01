"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const errors = (error, _, res, next) => {
    var _a;
    const statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    const message = error.message;
    return res.status(statusCode).json({ message: message });
};
exports.errors = errors;
//# sourceMappingURL=errors.middleware.js.map