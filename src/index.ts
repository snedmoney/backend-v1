import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import helmet from 'helmet';

import { AppDataSource } from './data-source';
import { TokenRouter } from '@/routers';

async function main() {
    const app: Express = express();
    app.use(cors());
    // parse various different custom JSON types as JSON
    app.use(bodyParser.json());
    // Set the application to trust the reverse proxy
    app.set('trust proxy', true);
    // Middlewares
    app.use(helmet());

    const dataSource = await AppDataSource.initialize();
    const tokenRouter = new TokenRouter(dataSource);

    app.use('/api/tokens', tokenRouter.router);

    const server = app.listen(8002, () => {
        console.log('server started');
    });
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.log('error', e);
    }
})();
