import express from 'express';

import { log } from '../../controllers';
import { auth } from '../../middlewares';

const router = express.Router();

router.get('/', auth.verifyToken, log.allLogs);

export default router;
