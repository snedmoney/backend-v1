import 'reflect-metadata';

import express, { Express } from 'express';

import { AppDataSource } from './data-source';
import { AuthRoutes } from '@/routers';
import { ChainRoutes } from './routers/chains';
// import authRouter from '@/routers/authorize';
import { LinkRoutes } from '@/routers/link';
import { PriceRoutes } from './routers/price';
import { TokenRoutes } from '@/routers/tokens';
import { TransactionRoutes } from '@/routers/transaction';
import { UserRoutes } from './routers';
// import settingRouter from '@/routers/setting';
import { WalletRoutes } from '@/routers/wallet';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from '@/common/middleware/errorHandler';
import fs from 'fs';
import helmet from 'helmet';
import { logger } from './util/logger';
import rateLimiter from '@/common/middleware/rateLimiter';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// import chainsRouter from '@/routers/chains';
import { verifyToken } from '@/util/jwt';

const app: Express = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SnedMoney API',
            description: 'SnedMoney API Information',
        },
        servers: [
            {
                url: 'https://backend-staging-hc8j.onrender.com',
            },
        ],
    },
    apis: ['./src/routers/*.{ts,js}'],
};

async function main() {
    const dataSource = await AppDataSource.initialize();
    const tokenRoutes = new TokenRoutes(dataSource);
    const chainRoutes = new ChainRoutes(dataSource);
    const walletRoutes = new WalletRoutes(dataSource);
    const authRouter = new AuthRoutes(dataSource);
    const priceRoutes = new PriceRoutes();
    const userRoutes = new UserRoutes(dataSource);
    const linkRoutes = new LinkRoutes(dataSource);
    const transactionsRoutes = new TransactionRoutes(dataSource);

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(cors());
    app.options('*', cors());
    // parse various different custom JSON types as JSON
    app.use(bodyParser.json());

    // Set the application to trust the reverse proxy
    app.set('trust proxy', true);

    // Middlewares
    app.use(helmet());

    app.use('/api/tokens', tokenRoutes.router);
    app.use('/api/chains', chainRoutes.router);
    
    // app.use(rateLimiter);
    app.use('/api/authorize', authRouter.router);
    app.use('/api/users', userRoutes.router);
    app.use('/api/price', priceRoutes.router);
    app.use('/api/links', linkRoutes.router);
    app.use('/api/transactions', transactionsRoutes.router);
    app.use(verifyToken);
    app.use('/api/wallets', walletRoutes.router);
    // Error handlers
    app.use(errorHandler());

    const port = process.env.PORT || 8002;

    const server = app.listen(port, async () => {
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
}

(async () => {
    try {
        await main();
    } catch (e) {
        // Deal with the fact the chain failed
        console.log('error', e);
    }
    // `text` is not available here
})();