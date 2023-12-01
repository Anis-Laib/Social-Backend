import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import 'dotenv/config';
import { ForbiddenError, UnauthorizedError } from '../helpers/apiErrors';
import { prisma } from '../lib/prisma';

export const verifyToken = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;

        // Cut the received string and takes the token at position 1.
        const token = authorization && authorization.split(' ')[1] || '';

        const payload: any = verify(token, process.env.JWT_SECRET);

        if (!payload)
            throw new UnauthorizedError();

        const user = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });

        if (!user)
            throw new UnauthorizedError();

        const { passwordHash, ...loggedUser } = user;
        // @ts-ignore
        req.user = loggedUser;

        next();
    } catch (error: any) {
        throw new ForbiddenError();
    }
};