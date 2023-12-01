"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.removeMember = exports.refuse = exports.accept = exports.leave = exports.join = exports.getPendings = exports.getMembers = exports.remove = exports.update = exports.create = exports.search = exports.getById = exports.getAll = void 0;
const prisma_1 = require("../lib/prisma");
const validations_1 = require("../helpers/validations");
const getAll = async (req, res) => {
    const groups = await prisma_1.prisma.group.findMany();
    return res.status(200).json({ groups });
};
exports.getAll = getAll;
const getById = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    // check if user is member of the group and is accepted
    const member = await prisma_1.prisma.groupMember.findUnique({
        where: {
            groupId_userId: {
                groupId: id,
                // @ts-ignore
                userId: req.user.id,
            },
            status: "ACCEPTED",
        },
    });
    if (!member) {
        try {
            const group = await prisma_1.prisma.group.findUnique({
                where: {
                    id: id
                },
                include: {
                    admin: true,
                    members: true,
                }
            });
            if (!group)
                return res.status(404).json({ message: 'Group not found' });
            return res.status(200).json({ group });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    else {
        try {
            const group = await prisma_1.prisma.group.findUnique({
                where: {
                    id: id
                },
                include: {
                    admin: true,
                    members: true,
                    posts: true
                }
            });
            if (!group)
                return res.status(404).json({ message: 'Group not found' });
            return res.status(200).json({ group });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
exports.getById = getById;
const search = async (req, res) => {
    const name = req.params.name;
    if (!name)
        return res.status(400).json({ message: 'Name is required' });
    try {
        const groups = await prisma_1.prisma.group.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            include: {
                admin: true,
                members: true,
            }
        });
        return res.status(200).json({ groups });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.search = search;
const create = async (req, res) => {
    const { error, value } = (0, validations_1.validateGroup)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    try {
        const newGroup = await prisma_1.prisma.group.create({
            data: {
                name: value.name,
                description: value.description,
                picture: value.picture,
                admin: {
                    connect: {
                        // @ts-ignore
                        id: req.user.id
                    }
                }
            }
        });
        await prisma_1.prisma.groupMember.create({
            data: {
                user: {
                    connect: {
                        // @ts-ignore
                        id: req.user.id
                    }
                },
                group: {
                    connect: {
                        id: newGroup.id
                    }
                },
                status: "ACCEPTED"
            }
        });
        return res.status(201).json({ newGroup });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const { error, value } = (0, validations_1.validateUpdateGroup)(req.body);
    if (error)
        return res.status(400).json({ message: error === null || error === void 0 ? void 0 : error.message });
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const updatedGroup = await prisma_1.prisma.group.update({
            where: {
                id: id
            },
            data: {
                name: value.name,
                description: value.description,
                picture: value.picture,
                isPrivate: value.isPrivate
            }
        });
        return res.status(200).json({ updatedGroup });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await prisma_1.prisma.group.delete({
            where: {
                id: id
            }
        });
        return res.status(200).json({ message: 'Group deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.remove = remove;
const getMembers = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    try {
        const members = await prisma_1.prisma.groupMember.findMany({
            where: {
                groupId: id
            },
            include: {
                user: true
            }
        });
        return res.status(200).json({ members });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getMembers = getMembers;
const getPendings = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const members = await prisma_1.prisma.groupMember.findMany({
            where: {
                groupId: id,
                status: "PENDING"
            },
            include: {
                user: true
            }
        });
        return res.status(200).json({ members });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getPendings = getPendings;
const join = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    try {
        const stat = group.isPrivate ? "PENDING" : "ACCEPTED";
        const member = await prisma_1.prisma.groupMember.create({
            data: {
                user: {
                    connect: {
                        // @ts-ignore
                        id: req.user.id
                    }
                },
                group: {
                    connect: {
                        id: id
                    }
                },
                status: stat
            }
        });
        return res.status(201).json({ member });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.join = join;
const leave = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const member = await prisma_1.prisma.groupMember.findUnique({
        where: {
            groupId_userId: {
                groupId: id,
                // @ts-ignore
                userId: req.user.id
            }
        }
    });
    if (!member)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await prisma_1.prisma.groupMember.delete({
            where: {
                groupId_userId: {
                    groupId: id,
                    // @ts-ignore
                    userId: req.user.id
                }
            }
        });
        return res.status(200).json({ message: 'You left the group' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.leave = leave;
const accept = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    if (!userId)
        return res.status(400).json({ message: 'User id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const member = await prisma_1.prisma.groupMember.update({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId: userId
                }
            },
            data: {
                status: "ACCEPTED"
            }
        });
        return res.status(200).json({ member });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.accept = accept;
const refuse = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    if (!userId)
        return res.status(400).json({ message: 'User id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const member = await prisma_1.prisma.groupMember.update({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId: userId
                }
            },
            data: {
                status: "REJECTED"
            }
        });
        return res.status(200).json({ member });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.refuse = refuse;
const removeMember = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    if (!userId)
        return res.status(400).json({ message: 'User id is required' });
    const group = await prisma_1.prisma.group.findUnique({
        where: {
            id: id
        },
        include: {
            admin: true
        }
    });
    if (!group)
        return res.status(404).json({ message: 'Group not found' });
    // @ts-ignore
    if (req.user.id !== group.admin.id)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await prisma_1.prisma.groupMember.delete({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId: userId
                }
            }
        });
        return res.status(200).json({ message: 'Member removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.removeMember = removeMember;
const getPosts = async (req, res) => {
    const id = req.params.id;
    if (!id)
        return res.status(400).json({ message: 'Id is required' });
    const member = await prisma_1.prisma.groupMember.findUnique({
        where: {
            groupId_userId: {
                groupId: id,
                // @ts-ignore
                userId: req.user.id
            },
            status: "ACCEPTED"
        }
    });
    if (!member)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const posts = await prisma_1.prisma.post.findMany({
            where: {
                groupId: id
            },
            include: {
                likes: true,
                author: true,
            }
        });
        return res.status(200).json({ posts });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getPosts = getPosts;
//# sourceMappingURL=group.controller.js.map