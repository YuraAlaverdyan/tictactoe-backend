import http from 'http';
import { Server, Socket } from 'socket.io';
import logger from '@/utils/logger';
import { UserModel } from '@/models/user';
import { IUserSocket } from '@/models/user/user.types';
import { Player } from '@/game/player';

export class SocketService {
    public io: Server;
    public connections: Map<string, IUserSocket> = new Map();

    constructor(server: http.Server) {
        this.io = new Server(server);

        this.configureSocketEvents();
    }

    private configureSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            logger.info('User connected');

            socket.on('loggedIn', async (id: string) => {
                logger.info(`User ${id} logged in`);
                await this.loggedInUser(id, socket);
            });

            socket.on('disconnect', () => {
                logger.info('User disconnected');
                this.connections.delete(socket.id);
                this.io.emit('onlineUsers', {
                    users: Array.from(this.connections.values()).map((value) => value.user),
                });
            });
        });
    }

    private async loggedInUser(_id: string, socket: Socket) {
        const user = await UserModel.findOne({ _id });

        if (!user) {
            return;
        }

        const player = new Player(user, socket);

        this.connections.set(socket.id, player);

        this.io.emit('onlineUsers', {
            users: Array.from(this.connections.values()).map((value) => value.user),
        });
    }
}
