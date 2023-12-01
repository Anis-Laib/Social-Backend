import { Router } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import groupRoutes from './group.routes';
import postRoutes from './post.routes';
import chatRoutes from './chat.routes'; 

const routes: Router = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/groups', groupRoutes);
routes.use('/posts', postRoutes);
routes.use('/chat', chatRoutes);

export default routes;