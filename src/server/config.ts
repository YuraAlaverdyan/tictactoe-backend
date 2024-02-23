import express, { Express } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import { MongoDBService } from '@/database';
import { EnvConfig } from '@/config/env';
import { AuthRouter } from '@/router/authRouter';
import logger from '@/utils/logger';

export class Server {
    private port = process.env.PORT || 8080;
    private mongoDB: MongoDBService;
    private env: EnvConfig;

    constructor(app: Express) {
        this.env = EnvConfig.getInstance();
        this.mongoDB = new MongoDBService(this.env.get('MONGODB_URI'));

        this.configureServer(app);
        this.initializeRoutes(app);
        this.connectDatabase().then(() => {
            logger.info('Database connected successfully');
        });
    }

    private configureServer(app: Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(
            cors({
                origin: '*',
            }),
        );
        app.use(express.json());
        app.use(express.static('build', { maxAge: '31536000' }));

        app.listen(this.port);
    }

    private async connectDatabase(): Promise<void> {
        await this.mongoDB.connect();
    }

    private initializeRoutes(app: Express) {
        const authRouter = new AuthRouter().router;
        app.use('/auth', authRouter);
    }
}
