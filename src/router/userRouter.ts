import express, { Request, Response, Router } from 'express';

import { ValidationSchema } from '@/utils/validation/ValidationSchema';
import { UserController } from '@/controller/userController';
import { Middleware } from '@/middlewares';
import logger from '@/utils/logger';

export class UserRouter {
    public router: Router;
    private readonly userController: UserController;

    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initializeRoutes().then(() => logger.info('UserRouter initialized'));
    }

    private async initializeRoutes(): Promise<void> {
        this.router.post(
            '/invitePlayer',
            Middleware.authenticate,
            await Middleware.validate(ValidationSchema.invitePlayer()),
            (req: Request, res: Response) => this.userController.invitePlayer(req, res),
        );
    }
}
