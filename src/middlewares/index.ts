import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ResponseHandler } from '@/utils/responseHandler';
import { CustomError } from '@/utils/CustomError';
import logger from '@/utils/logger';
import { UserModel } from '@/models/user';
import { JwtOperations } from '@/utils/JWT';

export class Middleware {
    public static async validate(schema: Joi.ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { error } = schema.validate(req.body);

            if (error) {
                logger.error(`DATA VALIDATION: ${error}`);

                const errorObject = new CustomError(
                    'Missing or wrong fields',
                    403,
                    true,
                    error.details,
                );

                return ResponseHandler.sendResponse(res, req, errorObject, 200, '');
            }
            next();
        };
    }

    public static async authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            const errorObject = new CustomError('Missing Authorization header', 401, true);

            return ResponseHandler.sendResponse(res, req, errorObject, 200, '');
        }

        const token = authHeader.replace('Bearer ', '');

        const userToken = JwtOperations.verifyToken(token);

        if (!userToken) {
            const errorObject = new CustomError('Error verifying token', 401, true);

            return ResponseHandler.sendResponse(res, req, errorObject, 200, '');
        }

        const user = await UserModel.findOne({
            username: userToken.username,
        });

        if (!user) {
            const errorObject = new CustomError('User not found', 401, true);

            return ResponseHandler.sendResponse(res, req, errorObject, 200, '');
        }

        req.user = user;
        next();
    }
}
