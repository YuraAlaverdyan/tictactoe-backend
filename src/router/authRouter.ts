import express, { Request, Response, Router } from 'express';
import { AuthController } from '@/controller/authController';
import { Middleware } from '@/middlewares';
import { ValidationSchema } from '@/utils/validation/ValidationSchema';
import logger from '@/utils/logger';

export class AuthRouter {
    public router: Router;
    private readonly authController: AuthController;

    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes().then(() => logger.info('AuthRouter initialized'));
    }

    private async initializeRoutes(): Promise<void> {
        this.router.post(
            '/register',
            await Middleware.validate(ValidationSchema.authUser()),
            (req: Request, res: Response) => this.authController.register(req, res),
        );
        this.router.post(
            '/login',
            await Middleware.validate(ValidationSchema.authUser()),
            (req: Request, res: Response) => this.authController.login(req, res),
        );
    }
}
