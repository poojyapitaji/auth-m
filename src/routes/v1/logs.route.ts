import { Router } from 'express';

import { log } from '../../controllers';
import { auth } from '../../middlewares';

const router = Router();

router.use(auth.verifyToken);

router.get('/', log.getAllLogs);

export default router;
