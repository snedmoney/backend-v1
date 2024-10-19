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
import { verifyToken } from '@/util/jwt';
import { AppDataSource } from './data-source';
import { logger } from './util/logger';

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
app.use(verifyToken);
app.use('/api/link', linkRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/tokens', tokensRouter);

// Error handlers
app.use(errorHandler());

AppDataSource.initialize().catch((error) => console.log(error));

const server = app.listen(8002, () => {
    logger.info(`Server started`);
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
