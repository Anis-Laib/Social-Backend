import { Router } from 'express';

import { verifyToken } from '../middlewares/auth.middleware';

import * as chat from '../controllers/chat.controller';

const routes: Router = Router();

routes.get('/', verifyToken, chat.getAll);
routes.get('/:id', verifyToken, chat.getById);
routes.get('/:id/messages', verifyToken, chat.getMessages);

routes.post('/', verifyToken, chat.create);
routes.post('/:id/add', verifyToken, chat.addUser);

export default routes;