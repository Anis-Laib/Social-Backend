"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWsRequest = exports.validateChat = exports.validatePost = exports.validateUpdateGroup = exports.validateGroup = exports.validateId = exports.validatePassword = exports.validateEmail = exports.validateSignIn = exports.validateUpdateUser = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUser = (user) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .min(3)
            .max(30)
            .required(),
        email: joi_1.default.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi_1.default.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
        repeatPassword: joi_1.default.ref('password'),
        firstname: joi_1.default.string()
            .min(3)
            .max(30)
            .required(),
        lastname: joi_1.default.string()
            .min(3)
            .max(30)
            .required(),
        profilePicture: joi_1.default.string().optional(),
        bio: joi_1.default.string().optional(),
        phone: joi_1.default.string().optional(),
        dateOfBirth: joi_1.default.date().optional()
    }).with('password', 'repeatPassword');
    return schema.validate(user, { presence: 'required' });
};
exports.validateUser = validateUser;
const validateUpdateUser = (user) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .min(3)
            .max(30)
            .optional(),
        email: joi_1.default.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
        firstname: joi_1.default.string()
            .min(3)
            .max(30)
            .optional(),
        lastname: joi_1.default.string()
            .min(3)
            .max(30)
            .optional(),
        profilePicture: joi_1.default.string().optional(),
        bio: joi_1.default.string().optional(),
        phone: joi_1.default.string().optional(),
        dateOfBirth: joi_1.default.date().optional()
    }).with('password', 'repeatPassword');
    return schema.validate(user, { presence: 'required' });
};
exports.validateUpdateUser = validateUpdateUser;
const validateSignIn = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi_1.default.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    });
    return schema.validate(user, { presence: 'required' });
};
exports.validateSignIn = validateSignIn;
const validateEmail = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    });
    return schema.validate(user, { presence: 'required' });
};
exports.validateEmail = validateEmail;
const validatePassword = (user) => {
    const schema = joi_1.default.object({
        password: joi_1.default.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    });
    return schema.validate(user, { presence: 'required' });
};
exports.validatePassword = validatePassword;
const validateId = (user) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().required()
    });
    return schema.validate(user, { presence: 'required' });
};
exports.validateId = validateId;
const validateGroup = (group) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string()
            .min(3)
            .max(30).required(),
        description: joi_1.default.string().optional(),
        picture: joi_1.default.string().optional(),
        isPrivate: joi_1.default.boolean().required()
    });
    return schema.validate(group, { presence: 'required' });
};
exports.validateGroup = validateGroup;
const validateUpdateGroup = (group) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string()
            .min(3)
            .max(30).optional(),
        description: joi_1.default.string().optional(),
        picture: joi_1.default.string().optional(),
        isPrivate: joi_1.default.boolean().optional()
    });
    return schema.validate(group, { presence: 'required' });
};
exports.validateUpdateGroup = validateUpdateGroup;
const validatePost = (post) => {
    const schema = joi_1.default.object({
        content: joi_1.default.string()
            .min(5)
            .max(500).required(),
        image: joi_1.default.string().optional(),
        groupId: joi_1.default.string().required()
    });
    return schema.validate(post, { presence: 'required' });
};
exports.validatePost = validatePost;
const validateChat = (chat) => {
    const schema = joi_1.default.object({
        users: joi_1.default.array().items(joi_1.default.string()).min(1).required()
    });
    return schema.validate(chat, { presence: 'required' });
};
exports.validateChat = validateChat;
const validateWsRequest = (message) => {
    const schema = joi_1.default.object({
        type: joi_1.default.string().required(),
        content: joi_1.default.string()
            .min(1)
            .max(500).required(),
        chatId: joi_1.default.number().required(),
        token: joi_1.default.string().required()
    });
    return schema.validate(message, { presence: 'required' });
};
exports.validateWsRequest = validateWsRequest;
//# sourceMappingURL=validations.js.map