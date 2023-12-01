import { Router } from 'express';

import * as group from '../controllers/group.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const routes: Router = Router();

routes.get('/', group.getAll);
routes.get('/:id', verifyToken, group.getById);
routes.get('/:id/members', group.getMembers);
routes.get('/:id/pendings', verifyToken, group.getPendings);
routes.get('/:id/posts', verifyToken, group.getPosts);
routes.get('/search/:name', verifyToken, group.search);

routes.post('/', verifyToken, group.create);
routes.post('/:id/join', verifyToken, group.join);
routes.post('/:id/leave', verifyToken, group.leave);
routes.post('/:id/accept/:userId', verifyToken, group.accept);
routes.post('/:id/refuse/:userId', verifyToken, group.refuse);
routes.post('/:id/kick/:userId', verifyToken, group.removeMember);

routes.put('/:id', verifyToken, group.update);

routes.delete('/:id', verifyToken, group.remove);

export default routes;