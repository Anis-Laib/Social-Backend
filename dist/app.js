"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_ws_1 = __importDefault(require("express-ws"));
const routes_1 = __importDefault(require("./routes"));
const errors_middleware_1 = require("./middlewares/errors.middleware");
const ws_1 = require("./lib/ws");
const validations_1 = require("./helpers/validations");
const prisma_1 = require("./lib/prisma");
const app = (0, express_1.default)();
// Cross Origin Resource Sharing
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
// Middleware for cookies
app.use((0, cookie_parser_1.default)());
// Built-in middleware for json
app.use(express_1.default.json());
// Built-in middleware to handle urlencoded form data
app.use(express_1.default.urlencoded({ extended: false }));
// Routes
app.use('/api', routes_1.default);
// Middleware for websocket
(0, express_ws_1.default)(app);
// Websocket
const chatRooms = {};
// @ts-ignore
app.ws('/ws', async (ws, req) => {
    ws.on('message', async (msg) => {
        const { error, value } = (0, validations_1.validateWsRequest)(JSON.parse(msg));
        if (error)
            return ws.send(JSON.stringify({ error: error.message }));
        const valid = await (0, ws_1.verifyWsToken)(value.token);
        if (!valid)
            return ws.send(JSON.stringify({ error: 'Invalid token.' }));
        try {
            // verify if user is member of the chat
            const chat = await prisma_1.prisma.chat.findUnique({
                where: {
                    id: value.chatId
                },
                include: {
                    users: true
                }
            });
            if (!chat)
                return ws.send(JSON.stringify({ message: 'Chat not found.' }));
            // @ts-ignore
            const user = chat.users.find(user => user.id === valid.id);
            if (!user)
                return ws.send(JSON.stringify({ message: 'You are not allowed to access this chat.' }));
            switch (value.type) {
                case "JOIN":
                    if (!chatRooms[value.chatId]) {
                        chatRooms[value.chatId] = {};
                    }
                    if (!chatRooms[value.chatId][valid.id]) {
                        chatRooms[value.chatId][valid.id] = ws;
                    }
                    break;
                case "MSG":
                    const message = await prisma_1.prisma.message.create({
                        data: {
                            content: value.content,
                            chat: {
                                connect: {
                                    id: value.chatId
                                }
                            },
                            sender: {
                                connect: {
                                    id: valid.id
                                }
                            }
                        }
                    });
                    Object.entries(chatRooms[value.chatId]).forEach(([id, client]) => {
                        // @ts-ignore
                        if (id !== valid.id && client.readyState === 1) {
                            // @ts-ignore
                            client.send(JSON.stringify({ message }));
                        }
                    });
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            return ws.send(JSON.stringify({ error: error.message }));
        }
    });
    ws.on('close', () => {
        Object.entries(chatRooms).forEach(([chatId, users]) => {
            Object.entries(users).forEach(([userId, client]) => {
                if (client === ws) {
                    delete chatRooms[chatId][userId];
                }
            });
        });
    });
});
// Middleware for errors
app.use(errors_middleware_1.errors);
exports.default = app;
//# sourceMappingURL=app.js.map