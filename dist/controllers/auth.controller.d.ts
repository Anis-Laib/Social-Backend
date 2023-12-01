import { Request, Response } from "express";
import "dotenv/config";
export declare const authenticated: (_: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const me: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refresh: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
