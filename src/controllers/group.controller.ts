import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { validateGroup, validateUpdateGroup } from '../helpers/validations';

export const getAll = async (req: Request, res: Response) => {
    const groups = await prisma.group.findMany();

    return res.status(200).json({ groups });
}

export const getById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

      // check if user is member of the group and is accepted
        const member = await prisma.groupMember.findUnique({
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
                const group = await prisma.group.findUnique({
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
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            try {
                const group = await prisma.group.findUnique({
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
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
}

export const search = async (req: Request, res: Response) => {
    const name = req.params.name;

    if (!name)
        return res.status(400).json({ message: 'Name is required' });

    try {
        const groups = await prisma.group.findMany({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const create = async (req: Request, res: Response) => {
    const { error, value } = validateGroup(req.body);

    if (error)
        return res.status(400).json({ message: error?.message });

    try {
        const newGroup = await prisma.group.create({
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

        await prisma.groupMember.create({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const update = async (req: Request, res: Response) => {
    const { error, value } = validateUpdateGroup(req.body);

    if (error)
        return res.status(400).json({ message: error?.message });

    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const group = await prisma.group.findUnique({
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
        const updatedGroup = await prisma.group.update({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const remove = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const group = await prisma.group.findUnique({
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
        await prisma.group.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMembers = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    try {
        const members = await prisma.groupMember.findMany({
            where: {
                groupId: id
            },
            include: {
                user: true
            }
        });

        return res.status(200).json({ members });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPendings = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const group = await prisma.group.findUnique({
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
        const members = await prisma.groupMember.findMany({
            where: {
                groupId: id,
                status: "PENDING"
            },
            include: {
                user: true
            }
        });

        return res.status(200).json({ members });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const join = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const group = await prisma.group.findUnique({
        where: {
            id: id
        }
    });

    if (!group)
        return res.status(404).json({ message: 'Group not found' });

    try {
        const stat = group.isPrivate ? "PENDING" : "ACCEPTED";

        const member = await prisma.groupMember.create({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const leave = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const member = await prisma.groupMember.findUnique({
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
        await prisma.groupMember.delete({
            where: {
                groupId_userId: {
                    groupId: id,
                    // @ts-ignore
                    userId: req.user.id
                }
            }
        });

        return res.status(200).json({ message: 'You left the group' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const accept = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.params.userId;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    if (!userId)
        return res.status(400).json({ message: 'User id is required' });

    const group = await prisma.group.findUnique({
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
        const member = await prisma.groupMember.update({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const refuse = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.params.userId;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    if (!userId)
        return res.status(400).json({ message: 'User id is required' });

    const group = await prisma.group.findUnique({
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
        const member = await prisma.groupMember.update({
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
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const removeMember = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.params.userId;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    if (!userId)
        return res.status(400).json({ message: 'User id is required' });

    const group = await prisma.group.findUnique({
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
        await prisma.groupMember.delete({
            where: {
                groupId_userId: {
                    groupId: id,
                    userId: userId
                }
            }
        });

        return res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPosts = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id)
        return res.status(400).json({ message: 'Id is required' });

    const member = await prisma.groupMember.findUnique({
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
        const posts = await prisma.post.findMany({
            where: {
                groupId: id
            },
            include: {
                likes: true,
                author: true,
            }
        });

        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}