"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.getMessages = exports.create = exports.getById = exports.getAll = void 0;
const prisma_1 = require("../lib/prisma");
const validations_1 = require("../helpers/validations");
const getAll = async (req, res) => {
    try {
        const chats = await prisma_1.prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        //@ts-ignore
                        id: req.user.id,
                    },
                },
            },
            include: {
                users: true,
                messages: true,
            },
        });
        return res.status(200).json({ chats });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Chat id is required." });
    try {
        const chat = await prisma_1.prisma.chat.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                users: true,
                messages: true,
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found." });
        // @ts-ignore
        const user = chat.users.find((user) => user.id === req.user.id);
        if (!user)
            return res
                .status(403)
                .json({ message: "You are not allowed to access this chat." });
        return res.status(200).json({ chat });
    }
    catch (error) {
        return res.status(404).json({ message: "Chat not found." });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    const { error, value } = (0, validations_1.validateChat)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    let users = value.users;
    // @ts-ignore
    users.push(req.user.id);
    users = [...new Set(users)];
    try {
        const chat = await prisma_1.prisma.chat.create({
            data: {
                users: {
                    connect: value.users.map((user) => ({ id: user })),
                },
            },
            include: {
                users: true,
                messages: true,
            },
        });
        return res.status(201).json({ chat });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.create = create;
const getMessages = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Chat id is required." });
    try {
        const chat = await prisma_1.prisma.chat.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                users: true,
                messages: true,
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found." });
        // @ts-ignore
        const user = chat.users.find((user) => user.id === req.user.id);
        if (!user)
            return res
                .status(403)
                .json({ message: "You are not allowed to access this chat." });
        return res.status(200).json({ messages: chat.messages });
    }
    catch (error) {
        return res.status(404).json({ message: "Chat not found." });
    }
};
exports.getMessages = getMessages;
const addUser = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Chat id is required." });
    const { error, value } = (0, validations_1.validateChat)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    try {
        const chat = await prisma_1.prisma.chat.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                users: true,
                messages: true,
            },
        });
        if (!chat)
            return res.status(404).json({ message: "Chat not found." });
        // @ts-ignore
        const user = chat.users.find((user) => user.id === req.user.id);
        if (!user)
            return res
                .status(403)
                .json({ message: "You are not allowed to access this chat." });
        const users = [
            ...new Set([...chat.users.map((user) => user.id), ...value.users]),
        ];
        const updatedChat = await prisma_1.prisma.chat.update({
            where: {
                id: Number(id),
            },
            data: {
                users: {
                    connect: users.map((user) => ({ id: user })),
                },
            },
            include: {
                users: true,
                messages: true,
            },
        });
        return res.status(200).json({ chat: updatedChat });
    }
    catch (error) {
        return res.status(404).json({ message: "Chat not found." });
    }
};
exports.addUser = addUser;
//# sourceMappingURL=chat.controller.js.map