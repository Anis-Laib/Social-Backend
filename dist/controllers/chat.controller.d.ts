import { Request, Response } from "express";
export declare const getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
