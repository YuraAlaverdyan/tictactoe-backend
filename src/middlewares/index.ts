import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ResponseHandler } from '@/utils/responseHandler';
import { CustomError } from '@/utils/CustomError';
import logger from '@/utils/logger';

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
}
