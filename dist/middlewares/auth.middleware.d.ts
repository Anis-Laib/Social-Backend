import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
export declare const verifyToken: (req: Request, _: Response, next: NextFunction) => Promise<void>;
