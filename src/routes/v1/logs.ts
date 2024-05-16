import express from 'express';

import { log } from '../../controllers';
import { auth } from '../../middlewares';

const router = express.Router();

/**
 * @openapi
 * /:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get('/', auth.verifyToken, log.allLogs);

export default router;
