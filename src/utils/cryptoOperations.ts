import { CustomError } from '@/utils/CustomError';
import logger from '@/utils/logger';
import { EnvConfig } from '@/config/env';
import bcrypt from 'bcrypt';

export class CryptoOperations {
    private static env: EnvConfig = EnvConfig.getInstance();

    static hashPassword(password: string) {
        try {
            logger.debug(`CRYPTO OPERATIONS: Starting to hash password`);
            const hash = bcrypt.hashSync(password, this.env.getInt('SALT_ROUNDS') || 10);

            logger.info(`CRYPTO OPERATIONS: Password hashed successfully`);
            return hash;
        } catch (error) {
            logger.error(`CRYPTO OPERATIONS: Failed to hash password; \n ${error}`);
            return new CustomError('Internal Server Error', 500, true);
        }
    }

    static comparePasswords(inputPassword: string, password: string) {
        try {
            logger.debug(`CRYPTO OPERATIONS: Starting to compare passwords`);

            const isSame = bcrypt.compareSync(inputPassword, password);

            if (!isSame) {
                return new CustomError('Passwords is not matching', 403, true);
            }

            logger.info(`CRYPTO OPERATIONS: Passwords match!`);
            return isSame;
        } catch (error) {
            logger.error(`CRYPTO OPERATIONS: Failed to compare passwords; \n ${error}`);
            return new CustomError('Internal Server Error', 500, true);
        }
    }
}
