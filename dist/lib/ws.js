"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWsToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv/config");
const apiErrors_1 = require("../helpers/apiErrors");
const prisma_1 = require("../lib/prisma");
const verifyWsToken = async (token) => {
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        if (!payload)
            throw new apiErrors_1.UnauthorizedError();
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });
        if (!user)
            throw new apiErrors_1.UnauthorizedError();
        const { passwordHash } = user, loggedUser = __rest(user, ["passwordHash"]);
        return loggedUser;
    }
    catch (error) {
        return false;
    }
};
exports.verifyWsToken = verifyWsToken;
//# sourceMappingURL=ws.js.map