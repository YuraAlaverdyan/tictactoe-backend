import express, { Express } from 'express';

import http from 'http';
import bodyParser from 'body-parser';

import cors from 'cors';
import { MongoDBService } from '@/database';
import { EnvConfig } from '@/config/env';
import { AuthRouter } from '@/router/authRouter';
import logger from '@/utils/logger';
import { SocketService } from '@/socket';
import { UserRouter } from '@/router/userRouter';

export class Server {
    private readonly server: http.Server;
    public static socketService: SocketService;
    private mongoDB: MongoDBService;
    private env: EnvConfig = EnvConfig.getInstance();
    private port = process.env.PORT || this.env.getInt('PORT');

    constructor(app: Express) {
        this.mongoDB = new MongoDBService(this.env.get('MONGODB_URI'));

        this.server = http.createServer(app);
        Server.socketService = new SocketService(this.server);
        this.configureServer(app);
        this.initializeRoutes(app);
        this.connectDatabase().then(() => {
            logger.info('Database connected successfully');
        });
        this.server.listen(this.port);
    }

    private configureServer(app: Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(
            cors({
                origin: ['http://localhost:3000', '*'], // Allow requests from this origin
            }),
        );
        app.use(express.json());
        app.use(express.static('build', { maxAge: '31536000' }));
    }

    private async connectDatabase(): Promise<void> {
        await this.mongoDB.connect();
    }

    private initializeRoutes(app: Express) {
        const authRouter = new AuthRouter().router;
        app.use('/auth', authRouter);

        const userRouter = new UserRouter().router;
        app.use('/user', userRouter);
    }
}
