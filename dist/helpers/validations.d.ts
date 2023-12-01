import { Group, Post } from '@prisma/client';
import { IUser } from 'interfaces/usert';
import Joi from 'joi';
export declare const validateUser: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validateUpdateUser: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validateSignIn: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validateEmail: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validatePassword: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validateId: (user: IUser) => Joi.ValidationResult<IUser>;
export declare const validateGroup: (group: Group) => Joi.ValidationResult<{
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    picture: string;
    adminId: string;
}>;
export declare const validateUpdateGroup: (group: Group) => Joi.ValidationResult<{
    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    picture: string;
    adminId: string;
}>;
export declare const validatePost: (post: Post) => Joi.ValidationResult<{
    id: string;
    content: string;
    image: string;
    authorId: string;
    groupId: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const validateChat: (chat: any) => Joi.ValidationResult<any>;
export declare const validateWsRequest: (message: any) => Joi.ValidationResult<any>;
