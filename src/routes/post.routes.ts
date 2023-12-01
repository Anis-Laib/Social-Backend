import { Router } from 'express';

import * as posts from '../controllers/post.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const routes: Router = Router();

routes.get('/:id', posts.getById);

routes.post('/', verifyToken, posts.create);
routes.post('/:id/like', verifyToken, posts.like);
routes.post('/:id/unlike', verifyToken, posts.unlike);

routes.delete('/:id', verifyToken, posts.remove);

export default routes;