import jwt from 'jsonwebtoken';

import { CustomError } from '@/utils/CustomError';
import { EnvConfig } from '@/config/env';
import logger from '@/utils/logger';

export class JwtOperations {
    private static env: EnvConfig = EnvConfig.getInstance();

    public static signToken(username: string) {
        try {
            logger.debug(`JWT: Starting to sign token...`);

            const token = jwt.sign({ username }, this.env.get('JWT_SECRET'), { expiresIn: '1y' });

            logger.info(`JWT: Token for user signed successfully`);
            return { token };
        } catch (error) {
            logger.error(`JWT: Error signing token; \n ${error}`);
            return new CustomError(`Internal Server Error`, 500, true);
        }
    }
}
