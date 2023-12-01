import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

import bcrypt from "bcrypt";

import { validateUpdateUser, validateUser } from "../helpers/validations";
import { BadRequestError } from "../helpers/apiErrors";

export const getAll = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  // Remove the password field from each user object
  const usersWithoutPasswords = users.map((user) => {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return res.json({ users: usersWithoutPasswords });
};

export const search = async (req: Request, res: Response) => {
  const { search, take, skip } = req.query;

  const users = await prisma.user.findMany({
    take: take != undefined ? Number(take) : 10,
    skip: skip != undefined ? Number(skip) : undefined,
    where: {
      username: {
        contains: String(search),
      },
      firstname: {
        contains: String(search),
      },
      lastname: {
        contains: String(search),
      },
    },
  });

  // Remove the password field from each user object
  const usersWithoutPasswords = users.map((user) => {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return res.json({ users: usersWithoutPasswords });
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "User id is required." });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  return res.json({ user });
};

export const create = async (req: Request, res: Response) => {
  const { error, value } = validateUser(req.body);

  if (error) return res.status(400).json({ message: error?.message });

  const userExists = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
  });

  if (userExists) throw new BadRequestError("This User already exists!");

  // Encrypting user password.
  const hashPassword = await bcrypt.hash(value.password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: value.username,
      email: value.email,
      passwordHash: hashPassword,
      firstname: value.firstname,
      lastname: value.lastname,
      profilePicture: value.profilePicture,
      bio: value.bio,
      phone: value.phone,
      dateOfBirth: value.dateOfBirth,
    },
  });

  const newUserWithoutPassword = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    profilePicture: newUser.profilePicture,
    bio: newUser.bio,
    phone: newUser.phone,
    dateOfBirth: newUser.dateOfBirth,
  };

  return res.status(201).json({ newUserWithoutPassword });
};

export const update = async (req: Request, res: Response) => {
  const { error, value } = validateUpdateUser(req.body);

  if (error) return res.status(400).json({ message: error?.message });

  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: req.user.id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  try {
    const updatedUser = await prisma.user.update({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      data: {
        username: value.name,
        email: value.email,
        firstname: value.firstname,
        lastname: value.lastname,
        profilePicture: value.profilePicture,
        bio: value.bio,
        phone: value.phone,
        dateOfBirth: value.dateOfBirth,
      },
    });

    const updatedUserWithoutPassword = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.dateOfBirth,
    };

    return res.status(200).json({ updatedUserWithoutPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred updating the user." });
  }
};

export const follow = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "User id is required." });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  try {
    const follow = await prisma.follow.create({
      data: {
        follower: {
          connect: {
            // @ts-ignore
            id: req.user.id,
          },
        },
        following: {
          connect: {
            id,
          },
        },
      },
    });

    return res.status(201).json({ follow });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "User id is required." });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          // @ts-ignore
          followerId: req.user.id,
          followingId: id,
        },
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "User id is required." });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
    });

    return res.status(200).json({ followers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "User id is required." });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found." });

  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
    });

    return res.status(200).json({ following });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOwnFollowers = async (req: Request, res: Response) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        // @ts-ignore
        followingId: req.user.id,
      },
      include: {
        follower: true,
      },
    });

    return res.status(200).json({ followers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOwnFollowing = async (req: Request, res: Response) => {
  try {
    const following = await prisma.follow.findMany({
      where: {
        // @ts-ignore
        followerId: req.user.id,
      },
      include: {
        following: true,
      },
    });

    return res.status(200).json({ following });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOwnGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.groupMember.findMany({
      where: {
        // @ts-ignore
        userId: req.user.id,
      },
    });

    return res.status(200).json({ groups });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    // find posts from all the groups that the req.user is accepted on
    const groups = await prisma.groupMember.findMany({
      where: {
        // @ts-ignore
        userId: req.user.id,
        status: "ACCEPTED",
      },
      select: {
        group: true,
      },
    });

    const groupsIds = groups.map((group) => group.group.id);

    const posts = await prisma.post.findMany({
      where: {
        groupId: {
          in: groupsIds,
        },
      },
      include: {
        author: true,
        likes: true,
      },
    });

    return res.status(200).json({ posts });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred getting the feed." });
  }
};

// export const emailConfirmation = async (req: Request, res: Response) => {
//     try {
//         const { token } = req.params;

//         // Check the database to see if the token is present and the expiration date has not passed.
//         const confirmEmailToken = await prisma.token.findFirst({
//             where: {
//                 token,
//                 type: 'emailConfirmation',
//                 expiresAt: {
//                     gte: new Date()
//                 }
//             }
//         });

//         const user = await prisma.user.findFirst({
//             where: {
//                 id: confirmEmailToken?.userId
//             }
//         })

//         if (!user)
//             throw new BadRequestError('There is no user with this email in our database.');

//         // If the token is expired, the confirmation email will be sent again.
//         if (!confirmEmailToken || confirmEmailToken.used) {
//             await resendEmail(user, token);

//             throw new BadRequestError('Invalid or expired confirmation token.');
//         }

//         // Changes the user's status to verified.
//         await prisma.user.update({
//             where: {
//                 id: user!.id
//             },
//             data: {
//                 email_verified: true
//             }
//         });

//         // Changes the status of the token as used.
//         await prisma.token.update({
//             where: {
//                 token
//             },
//             data: {
//                 used: true
//             }
//         });

//         await prisma.token.delete({
//             where: {
//                 token
//             }
//         });

//         const templateEmailConfirmed = template.generate('email-confirmed', 'Email confirmed');

//         return res.status(200).send(templateEmailConfirmed);
//     } catch (error: any) {
//         return res.status(500).json({ message: 'An error occurred validating the email provided.' });
//     }
// };

// export const forgotPassword = async (req: Request, res: Response) => {
//     const { error, value } = validateEmail(req.body);

//     if (error)
//         return res.status(400).json({ message: error?.message });

//     const user = await prisma.user.findFirst({
//         where: {
//             email: value.email
//         }
//     });

//     if (!user)
//         throw new BadRequestError('There is no user with this email in our database.');

//     const { token } = await prisma.token.create({
//         data: {
//             userId: user!.id,
//             token: emailToken.generateNewToken(),
//             type: 'resetPassword',
//             expiredAt: emailToken.generateExpirationDate()
//         }
//     });

//     const url = `${process.env.BASE_URL}:3000/reset-password/${token}`;

//     const message: IMessage = {
//         to: {
//             name: user.name,
//             email: value.email
//         },
//         subject: 'Reset your account password',
//         template: {
//             name: 'reset-password',
//             url
//         }
//     }

//     await sendEmail(message);

//     return res.status(200).send('Password reset email sent successfully.');
// };

// export const resetPassword = async (req: Request, res: Response) => {
//     const { token } = req.params;
//     const { error, value } = validatePassword(req.body);

//     if (error)
//         return res.status(400).json({ message: error?.message });

//     // Check the database to see if the token is present and the expiration date has not passed.
//     const resetPasswordToken = await prisma.token.findFirst({
//         where: {
//             token,
//             type: 'resetPassword',
//             expiredAt: {
//                 gte: new Date()
//             }
//         }
//     });

//     if (!resetPasswordToken || resetPasswordToken.used)
//         throw new BadRequestError('Invalid or expired reset password token.');

//     // Encrypting user password.
//     const hashPassword = await bcrypt.hash(value.password, 10);

//     await prisma.user.update({
//         where: {
//             id: resetPasswordToken.userId
//         },
//         data: {
//             password: hashPassword
//         }
//     });

//     // Changes the status of the token as used.
//     await prisma.token.update({
//         where: {
//             token
//         },
//         data: {
//             used: true
//         }
//     });

//     await prisma.token.delete({
//         where: {
//             token
//         }
//     });

//     return res.status(200).send('Password reset successfully.');
// };
