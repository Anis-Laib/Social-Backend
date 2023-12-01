import { Router } from 'express';

import { verifyToken } from '../middlewares/auth.middleware';

import * as auth from '../controllers/auth.controller';

const routes: Router = Router();

routes.get('/', verifyToken, auth.authenticated);
routes.get('/me', verifyToken, auth.me);

routes.post('/login', auth.login);
routes.post('/logout', auth.logout);
routes.post('/refresh', auth.refresh);

export default routes;