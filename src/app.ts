import express from 'express';
import cookieParser from 'cookie-parser';

import { cors, morgan } from './middlewares';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);
morgan(app);

app.use('/', routes);

export default app;
