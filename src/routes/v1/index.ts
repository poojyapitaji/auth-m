import { Router, Request, Response } from 'express';
import config from 'config';

// import swaggerDocs from '../../utils/swagger.utils';
import logRouter from './logs.route';
// import app from '../../app';

const router = Router();

const environment = config.get<string>('environment');
// const port = config.get<string>('server.port');
const isDev = environment === 'development';

router.get('/', (_req: Request, res: Response) => {
  res.redirect('/v1/docs');
});

router.use('/log', logRouter);

if (isDev) {
  // swaggerDocs(app, port, 'v1');
}

export default router;
