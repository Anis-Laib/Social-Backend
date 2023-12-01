import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { validateChat } from "../helpers/validations";

export const getAll = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Chat id is required." });

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found." });

    // @ts-ignore
    const user = chat.users.find((user) => user.id === req.user.id);

    if (!user)
      return res
        .status(403)
        .json({ message: "You are not allowed to access this chat." });

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(404).json({ message: "Chat not found." });
  }
};

export const create = async (req: Request, res: Response) => {
  const { error, value } = validateChat(req.body);

  if (error) return res.status(400).json({ message: error?.message });

  let users = value.users;

  // @ts-ignore
  users.push(req.user.id);

  users = [...new Set(users)];

  try {
    const chat = await prisma.chat.create({
      data: {
        users: {
          connect: value.users.map((user: any) => ({ id: user })),
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    return res.status(201).json({ chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Chat id is required." });

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found." });

    // @ts-ignore
    const user = chat.users.find((user) => user.id === req.user.id);

    if (!user)
      return res
        .status(403)
        .json({ message: "You are not allowed to access this chat." });

    return res.status(200).json({ messages: chat.messages });
  } catch (error) {
    return res.status(404).json({ message: "Chat not found." });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Chat id is required." });

  const { error, value } = validateChat(req.body);

  if (error) return res.status(400).json({ message: error?.message });

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found." });

    // @ts-ignore
    const user = chat.users.find((user) => user.id === req.user.id);

    if (!user)
      return res
        .status(403)
        .json({ message: "You are not allowed to access this chat." });

    const users = [
      ...new Set([...chat.users.map((user) => user.id), ...value.users]),
    ];

    const updatedChat = await prisma.chat.update({
      where: {
        id: Number(id),
      },
      data: {
        users: {
          connect: users.map((user: any) => ({ id: user })),
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    return res.status(200).json({ chat: updatedChat });
  } catch (error) {
    return res.status(404).json({ message: "Chat not found." });
  }
};
