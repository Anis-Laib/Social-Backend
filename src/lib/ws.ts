import { verify } from 'jsonwebtoken';

import 'dotenv/config';
import { ForbiddenError, UnauthorizedError } from '../helpers/apiErrors';
import { prisma } from '../lib/prisma';
import { log } from 'console';

export const verifyWsToken = async (token: string) => {
    try {
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

        return loggedUser;
    } catch (error: any) {
        return false;
    }
};