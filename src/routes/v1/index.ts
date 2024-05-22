import { Router, Request, Response } from 'express';

import authRouter from './auth.route';
import logRouter from './logs.route';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.redirect('/api/v1/api-docs');
});

router.use('/log', logRouter);
router.use('/auth', authRouter);

export default router;
