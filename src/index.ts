if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';

import express, { Express } from 'express';
import helmet from 'helmet';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import authRouter from '@/routers/authorize';
import linkRouter from '@/routers/link';
import transactionRouter from '@/routers/transaction';
import tokensRouter from '@/routers/tokens';
import settingRouter from '@/routers/setting';
import walletRouter from '@/routers/wallet';
import chainsRouter from '@/routers/chains';
import { verifyToken } from '@/util/jwt';
import { logger } from './util/logger';
import { seedDatabase } from './util/seed';
import { seedChainsDatabase } from './util/seedChains';

const app: Express = express();

app.use(cors());
// parse various different custom JSON types as JSON
app.use(bodyParser.json());

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(helmet());
app.use(rateLimiter);
app.use('/api/authorize', authRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/chains', chainsRouter);
app.use(verifyToken);
app.use('/api/link', linkRouter);
app.use('/api/setting', settingRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/wallet', walletRouter);

// Error handlers
app.use(errorHandler());

const port = process.env.PORT || 8002;

const server = app.listen(port, async () => {
  logger.info(`Server started`);
  seedDatabase();
  seedChainsDatabase();
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
