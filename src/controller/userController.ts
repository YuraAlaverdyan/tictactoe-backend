import { Request, Response } from 'express';

import { ResponseHandler } from '@/utils/responseHandler';
import { UserService } from '@/service/userService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async invitePlayer(req: Request, res: Response) {
        const { userId } = req.body;
        const user = await this.userService.invitePlayer(userId, req.user!);
        ResponseHandler.sendResponse(res, req, user, 200, 'User invited successfully');
    }
}
