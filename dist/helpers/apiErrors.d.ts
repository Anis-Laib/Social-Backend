export declare class ApiError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class BadRequestError extends ApiError {
    constructor(message: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message: string);
}
export declare class ForbiddenError extends ApiError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
