import {Request, Response} from "express";

import {ResponseHandler} from "@/utils/responseHandler";
import {AuthService} from "@/service/authService";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response) {
        const {username, password} = req.body
        const user = await this.authService.register(username, password);
        ResponseHandler.sendResponse(res, req, user, 200, 'User created successfully')
    }
}