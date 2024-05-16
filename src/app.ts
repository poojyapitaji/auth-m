import express from 'express';
import cookieParser from 'cookie-parser';
import config from 'config';

import { cors, morgan } from './middlewares';
import { swagger } from './libs';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);
morgan(app);

app.use('/', routes);

const environment = config.get<string>('environment');
const isDev = environment === 'development';

if (isDev) {
  app.use('/api-docs', swagger.serve, swagger.setup);
}

export default app;
