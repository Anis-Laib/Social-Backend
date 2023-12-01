import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/apiErrors';
import { log } from 'console';

export const errors = (error: Error & Partial<ApiError>, _: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode ?? 500;
    const message = error.message;
    
    return res.status(statusCode).json({ message: message });
};