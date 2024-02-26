import { Document } from 'mongoose';
import { IUserModel } from '@/models/user/index';
import { Socket } from 'socket.io';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    wins: number;
    draws: number;
    losses: number;
}

export interface IUserSocket {
    user: IUserModel;
    socket: Socket;
}
