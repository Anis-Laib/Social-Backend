import { Router } from 'express';

import * as users from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const routes: Router = Router();

routes.get('/', users.getAll);
routes.get('/:id', users.getUser)
routes.get('/search', users.search);
routes.get('/:id/followers', users.getFollowers);
routes.get('/:id/following', users.getFollowing);
routes.get('/followers', verifyToken, users.getOwnFollowers);
routes.get('/following', verifyToken, users.getOwnFollowing);
routes.get('/groups', verifyToken, users.getOwnGroups);
routes.get('/feed', verifyToken, users.getFeed);

routes.post('/', users.create);
routes.post('/:id/follow', verifyToken, users.follow);
routes.post('/:id/unfollow', verifyToken, users.unfollow);

routes.put('/', verifyToken, users.update);

// routes.get('/email-confirmation/:token', users.emailConfirmation);
// routes.post('/forgot-password', users.forgotPassword);
// routes.patch('/reset-password/:token', users.resetPassword);

export default routes;