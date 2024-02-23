import { CryptoOperations } from '@/utils/cryptoOperations';
import { CustomError } from '@/utils/CustomError';
import { UserModel } from '@/models/user';
import logger from '@/utils/logger';
import { JwtOperations } from '@/utils/JWT';

export class AuthService {
    public async register(username: string, password: string) {
        try {
            const existingUser = await UserModel.findOne({
                username,
            });

            if (existingUser) {
                return new CustomError(
                    `User with username - ${username} already registered`,
                    400,
                    true,
                );
            }

            const hashedPassword = CryptoOperations.hashPassword(password);

            if (hashedPassword instanceof CustomError) {
                return hashedPassword;
            }

            const newUser = await new UserModel({
                username,
                password: hashedPassword,
                losses: 0,
                wins: 0,
                draws: 0,
            }).save();

            return {
                username: newUser.username,
                losses: newUser.losses,
                wins: newUser.wins,
                draws: newUser.draws,
            };
        } catch (error) {
            logger.error(`Error registering user ${error}`);
            return new CustomError('Internal Server Error', 500, true);
        }
    }

    public async login(username: string, password: string) {
        try {
            const existingUser = await UserModel.findOne({
                username,
            });

            if (!existingUser) {
                return new CustomError(
                    `User with username - ${username} does not exist`,
                    400,
                    true,
                );
            }

            const hashedPassword = CryptoOperations.comparePasswords(
                password,
                existingUser.password,
            );

            if (hashedPassword instanceof CustomError) {
                return hashedPassword;
            }

            if (!hashedPassword) {
                return new CustomError(`Passwords don't match`, 400, true);
            }

            return JwtOperations.signToken(existingUser.username);
        } catch (error) {
            logger.error(`Error logging in user ${error}`);
            return new CustomError('Internal Server Error', 500, true);
        }
    }
}
