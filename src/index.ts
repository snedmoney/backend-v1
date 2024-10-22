if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import 'reflect-metadata';

import express, { Express } from 'express';

import { AppDataSource } from './data-source';
import { ChainRoutes } from './routers/chains';
// import authRouter from '@/routers/authorize';
// import linkRouter from '@/routers/link';
// import transactionRouter from '@/routers/transaction';
import { TokenRoutes } from '@/routers/tokens';
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
              url: 'http://localhost:8002',
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

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(cors());
  // parse various different custom JSON types as JSON
  app.use(bodyParser.json());

  // Set the application to trust the reverse proxy
  app.set('trust proxy', true);

  // Middlewares
  app.use(helmet());
  app.use(rateLimiter);
  // app.use('/api/authorize', authRouter);

  app.use('/api/tokens', tokenRoutes.router);
  app.use('/api/chains', chainRoutes.router);
  // app.use('/api/chains', chainsRouter);
  app.use(verifyToken);
  // app.use('/api/link', linkRouter);
  // app.use('/api/setting', settingRouter);
  // app.use('/api/transaction', transactionRouter);
  app.use('/api/wallet', walletRoutes.router);

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