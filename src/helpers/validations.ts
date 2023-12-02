import { Group, Post } from '../generated/client';
import { IUser } from 'interfaces/usert';
import Joi from 'joi';

export const validateUser = (user: IUser) => {
    const schema = Joi.object<IUser>({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),

        repeatPassword: Joi.ref('password'),
        firstname: Joi.string()
            .min(3)
            .max(30)
            .required(),
        lastname: Joi.string()
            .min(3)
            .max(30)
            .required(),
        profilePicture: Joi.string().optional(),
        bio: Joi.string().optional(),
        phone: Joi.string().optional(),
        dateOfBirth: Joi.date().optional()
    }).with('password', 'repeatPassword');

    return schema.validate(user, { presence: 'required' });
};

export const validateUpdateUser = (user: IUser) => {
    const schema = Joi.object<IUser>({
        username: Joi.string()
            .min(3)
            .max(30)
            .optional(),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),

        firstname: Joi.string()
            .min(3)
            .max(30)
            .optional(),
        lastname: Joi.string()
            .min(3)
            .max(30)
            .optional(),
        profilePicture: Joi.string().optional(),
        bio: Joi.string().optional(),
        phone: Joi.string().optional(),
        dateOfBirth: Joi.date().optional()
    }).with('password', 'repeatPassword');

    return schema.validate(user, { presence: 'required' });
};

export const validateSignIn = (user: IUser) => {
    const schema = Joi.object<IUser>({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    });

    return schema.validate(user, { presence: 'required' });
};

export const validateEmail = (user: IUser) => {
    const schema = Joi.object<IUser>({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    });

    return schema.validate(user, { presence: 'required' });
};

export const validatePassword = (user: IUser) => {
    const schema = Joi.object<IUser>({
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    });

    return schema.validate(user, { presence: 'required' });
};

export const validateId = (user: IUser) => {
    const schema = Joi.object<IUser>({
        id: Joi.string().required()
    });

    return schema.validate(user, { presence: 'required' });
}

export const validateGroup = (group: Group) => {
    const schema = Joi.object<Group>({
        name: Joi.string()
            .min(3)
            .max(30).required(),
        description: Joi.string().optional(),
        picture: Joi.string().optional(),
        isPrivate: Joi.boolean().required()
    });

    return schema.validate(group, { presence: 'required' });
}

export const validateUpdateGroup = (group: Group) => {
    const schema = Joi.object<Group>({
        name: Joi.string()
            .min(3)
            .max(30).optional(),
        description: Joi.string().optional(),
        picture: Joi.string().optional(),
        isPrivate: Joi.boolean().optional()
    });

    return schema.validate(group, { presence: 'required' });
}

export const validatePost = (post: Post) => {
    const schema = Joi.object<Post>({
        content: Joi.string()
            .min(5)
            .max(500).required(),
        image: Joi.string().optional(),
        groupId: Joi.string().required()
    });

    return schema.validate(post, { presence: 'required' });
}

export const validateChat = (chat: any) => {
    const schema = Joi.object<any>({
        users: Joi.array().items(Joi.string()).min(1).required()
    });

    return schema.validate(chat, { presence: 'required' });
}

export const validateWsRequest = (message: any) => {
    const schema = Joi.object<any>({
        type: Joi.string().required(),
        content: Joi.string()
            .min(1)
            .max(500).required(),
        chatId: Joi.number().required(),
        token: Joi.string().required()
    });

    return schema.validate(message, { presence: 'required' });
}