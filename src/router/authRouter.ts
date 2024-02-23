import express, {Request, Response, Router} from 'express';
import {AuthController} from "@/controller/authController";

export class AuthRouter {
    public router: Router;
    private readonly authController: AuthController;

    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/register', (req: Request, res: Response) => this.authController.register(req, res));
    }
}