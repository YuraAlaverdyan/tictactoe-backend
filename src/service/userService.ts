import { IUser } from '@/models/user/user.types';
import { UserModel } from '@/models/user';
import { CustomError } from '@/utils/CustomError';
import logger from '@/utils/logger';
import { Server } from '@/server/config';

export class UserService {
    public async invitePlayer(userId: string, user: IUser) {
        try {
            const invitedUser = await UserModel.findOne({
                _id: userId,
            });

            if (!invitedUser) {
                return new CustomError(`User with id - ${userId} does not exist`, 400, true);
            }

            const invitedUserSocket = Array.from(Server.socketService.connections).find(
                ([, u]) => u.user.username === invitedUser.username,
            );

            if (!invitedUserSocket) {
                return new CustomError(`User with id - ${userId} not online`, 400, true);
            }

            //Server.socketService.connections is created with new Map, because of this we have invitedUserSocket array with 2 items
            invitedUserSocket[1].socket.emit('invite', {
                message: `Invite from ${user.username}`,
            });

            return true;
        } catch (error) {
            logger.error(`Error inviting in user ${error}`);
            return new CustomError('Internal Server Error', 500, true);
        }
    }
}
