import { Router } from 'express';

import { userController } from '../controllers';
import { auth as authMiddleware } from '../middlewares';

const router = Router();

router.use(authMiddleware.verifyToken);

router.get('/all', userController.getAllUsers);
router.get('/:uuid', userController.getUserByUuid);

export default router;
