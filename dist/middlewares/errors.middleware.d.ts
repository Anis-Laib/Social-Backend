import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/apiErrors';
export declare const errors: (error: Error & Partial<ApiError>, _: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
