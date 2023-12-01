"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlike = exports.like = exports.remove = exports.create = exports.getById = void 0;
const prisma_1 = require("../lib/prisma");
const validations_1 = require("../helpers/validations");
const getById = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Post id is required." });
    const post = await prisma_1.prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
            group: true,
            likes: true,
        },
    });
    if (!post)
        return res.status(404).json({ message: "Post not found." });
    return res.json({ post });
};
exports.getById = getById;
const create = async (req, res) => {
    const { error, value } = (0, validations_1.validatePost)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    const groupId = req.params.id;
    if (!groupId)
        return res.status(400).json({ message: "Group id is required." });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });
    if (!group)
        return res.status(404).json({ message: "Group not found." });
    // check if user is member of the group and is accepted
    const member = await prisma_1.prisma.groupMember.findUnique({
        where: {
            groupId_userId: {
                groupId: groupId,
                // @ts-ignore
                userId: req.user.id,
            },
            status: "ACCEPTED",
        },
    });
    if (!member)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const newPost = await prisma_1.prisma.post.create({
            data: {
                content: value.content,
                image: value.image,
                group: {
                    connect: {
                        id: groupId,
                    },
                },
                author: {
                    connect: {
                        // @ts-ignore
                        id: req.user.id,
                    },
                },
            },
        });
        return res.status(201).json({ newPost });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.create = create;
const remove = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Post id is required." });
    const post = await prisma_1.prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
            group: true,
        },
    });
    if (!post)
        return res.status(404).json({ message: "Post not found." });
    // @ts-ignore
    if (post.author.id !== req.user.id && post.group.adminId !== req.user.id)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        await prisma_1.prisma.post.delete({
            where: {
                id,
            },
        });
        return res.status(204).json();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.remove = remove;
const like = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Post id is required." });
    const post = await prisma_1.prisma.post.findUnique({
        where: {
            id,
        },
    });
    if (!post)
        return res.status(404).json({ message: "Post not found." });
    try {
        const like = await prisma_1.prisma.like.create({
            data: {
                post: {
                    connect: {
                        id,
                    },
                },
                user: {
                    connect: {
                        // @ts-ignore
                        id: req.user.id,
                    },
                },
            },
        });
        return res.status(201).json({ like });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.like = like;
const unlike = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: "Post id is required." });
    const post = await prisma_1.prisma.post.findUnique({
        where: {
            id,
        },
    });
    if (!post)
        return res.status(404).json({ message: "Post not found." });
    try {
        await prisma_1.prisma.like.delete({
            where: {
                postId_userId: {
                    postId: id,
                    // @ts-ignore
                    userId: req.user.id,
                },
            },
        });
        return res.status(204).json();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.unlike = unlike;
//# sourceMappingURL=post.controller.js.map