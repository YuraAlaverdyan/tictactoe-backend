import { Socket } from 'socket.io';
import { IUser } from '@/models/user/user.types';

export class Player {
    constructor(
        public user: IUser,
        public socket: Socket,
    ) {
        this.user = user;
        this.socket = socket;
    }
}
