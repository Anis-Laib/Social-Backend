import { Request, Response } from "express";
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const remove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const like: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unlike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
