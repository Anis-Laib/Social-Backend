import 'express-async-errors';

import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressWs from 'express-ws';

import routes from './routes';

import { errors } from './middlewares/errors.middleware';
import { verifyWsToken } from './lib/ws';
import { validateWsRequest } from './helpers/validations';
import { prisma } from './lib/prisma';
import { log } from 'console';

const app: Application = express();

// Cross Origin Resource Sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware for cookies
app.use(cookieParser());

// Built-in middleware for json
app.use(express.json());

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', routes);

// Middleware for websocket
expressWs(app);


// Websocket
const chatRooms: any = {};
// @ts-ignore
app.ws('/ws', async (ws, req) => {
    
    ws.on('message', async (msg: string) => {
        const { error, value } = validateWsRequest(JSON.parse(msg));

        if (error)
            return ws.send(JSON.stringify({ error: error.message }));

        const valid = await verifyWsToken(value.token)
        
        if (!valid)
                return ws.send(JSON.stringify({ error: 'Invalid token.' }));
        
        try {
                    // verify if user is member of the chat
        const chat = await prisma.chat.findUnique({
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
                break

            case "MSG":
                const message = await prisma.message.create({
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
                })

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
        } catch (error) {
            return ws.send(JSON.stringify({ error: error.message }));
        }
    });

    ws.on('close', () => {
        Object.entries(chatRooms).forEach(([chatId, users]: any) => {
            Object.entries(users).forEach(([userId, client]: any) => {
                if (client === ws) {
                    delete chatRooms[chatId][userId];
                }
            });
        });
    });
});

// Middleware for errors
app.use(errors);

export default app;