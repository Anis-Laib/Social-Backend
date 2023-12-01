"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.login = exports.me = exports.authenticated = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv/config");
const validations_1 = require("../helpers/validations");
const apiErrors_1 = require("../helpers/apiErrors");
const authenticated = async (_, res) => {
    return res.status(200).json({ message: "Welcome to the API" });
};
exports.authenticated = authenticated;
const me = async (req, res) => {
    // @ts-ignore
    return res.status(200).json({ user: req.user });
};
exports.me = me;
const login = async (req, res) => {
    const { error, value } = (0, validations_1.validateSignIn)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email: value.email,
        },
    });
    if (!user)
        throw new apiErrors_1.BadRequestError("Invalid email or password!");
    // Check the user password.
    const verifyPassword = await (0, bcrypt_1.compare)(value.password, user.passwordHash);
    if (!verifyPassword)
        throw new apiErrors_1.BadRequestError("Invalid email or password!");
    const refreshToken = (0, jsonwebtoken_1.sign)({ id: user.id, name: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.EXPIRES_IN_JWT_REFRESH_SECRET });
    // Set maxAge with 7 days.
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
    });
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    await prisma_1.prisma.token.create({
        data: {
            userId: user.id,
            type: "authentication",
            token: refreshToken,
            expiresAt: expiredAt,
        },
    });
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, name: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN_JWT_SECRET });
    return res.status(200).json({ token });
};
exports.login = login;
const logout = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken)
        throw new apiErrors_1.UnauthorizedError();
    await prisma_1.prisma.token.delete({
        where: {
            token: refreshToken,
        },
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        maxAge: 0,
        secure: true,
    });
    return res.sendStatus(204);
};
exports.logout = logout;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies["refreshToken"];
        const payload = (0, jsonwebtoken_1.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!payload)
            throw new apiErrors_1.UnauthorizedError();
        const dbToken = await prisma_1.prisma.token.findFirst({
            where: {
                userId: payload.id,
                type: "authentication",
                expiresAt: {
                    gte: new Date(),
                },
            },
        });
        if (!dbToken)
            throw new apiErrors_1.UnauthorizedError();
        const token = (0, jsonwebtoken_1.sign)({ id: payload.id, name: payload.name }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN_JWT_SECRET });
        return res.status(200).send({ token });
    }
    catch (error) {
        throw new apiErrors_1.ForbiddenError();
    }
};
exports.refresh = refresh;
//# sourceMappingURL=auth.controller.js.map