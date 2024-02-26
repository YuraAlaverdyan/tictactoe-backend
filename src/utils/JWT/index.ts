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

    public static verifyToken(token: string) {
        try {
            logger.debug(`JWT: Starting to verify token...`);
            const decoded = jwt.verify(token, this.env.get('JWT_SECRET'));

            if (typeof decoded === 'string') return null;

            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                logger.error('JWT: Token expired!');
                return null;
            }

            logger.info(`JWT: Token verified successfully`);

            return decoded;
        } catch (error) {
            logger.error(`JWT: Error verifying token; \n ${error}`);
            return null;
        }
    }
}
