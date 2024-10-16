import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import helmet from 'helmet';

import tokensRouter from '@/routers/tokens';

const app: Express = express();
app.use(cors());
// parse various different custom JSON types as JSON
app.use(bodyParser.json());
// Set the application to trust the reverse proxy
app.set('trust proxy', true);
// Middlewares
app.use(helmet());

app.use('/api/tokens', tokensRouter);

const server = app.listen(8002, () => {
  console.log('server started')
});
