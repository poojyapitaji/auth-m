import express from 'express';
import cookieParser from 'cookie-parser';
import config from 'config';

import cors from './middlewares/cors';
import morgan from './middlewares/morgan';
import routes from './routes';
import swagger from './libs/swagger';

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
