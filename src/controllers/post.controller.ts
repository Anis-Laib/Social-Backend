import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { validatePost } from "../helpers/validations";

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Post id is required." });

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      group: true,
      likes: true,
    },
  });

  if (!post) return res.status(404).json({ message: "Post not found." });

  return res.json({ post });
};

export const create = async (req: Request, res: Response) => {
  const { error, value } = validatePost(req.body);

  if (error) return res.status(400).json({ message: error?.message });

  const groupId = req.params.id;

  if (!groupId)
    return res.status(400).json({ message: "Group id is required." });

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) return res.status(404).json({ message: "Group not found." });

  // check if user is member of the group and is accepted
  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: groupId,
        // @ts-ignore
        userId: req.user.id,
      },
      status: "ACCEPTED",
    },
  });

  if (!member) return res.status(401).json({ message: "Unauthorized" });

  try {
    const newPost = await prisma.post.create({
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Post id is required." });

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      group: true,
    },
  });

  if (!post) return res.status(404).json({ message: "Post not found." });

  // @ts-ignore
  if (post.author.id !== req.user.id && post.group.adminId !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const like = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Post id is required." });

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) return res.status(404).json({ message: "Post not found." });

  try {
    const like = await prisma.like.create({
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const unlike = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Post id is required." });

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) return res.status(404).json({ message: "Post not found." });

  try {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId: id,
          // @ts-ignore
          userId: req.user.id,
        },
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
