import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import Logger from '../utils/log/Logger';
import { Inject } from 'typescript-ioc';
import { MessageRepository } from '../message/repository/messageRepository';
import { Message } from '../message/entity/message';

export class SocketServer {
  public static instance: SocketServer;
  public io: Server;
  public users: { [key: string]: any };
  @Inject
  private readonly messageRepository: MessageRepository;

  constructor(server: HttpServer) {
    SocketServer.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    });

    this.io.on('connect', this.initializeListener);
    Logger.info('connected to socket server');
  }

  private initializeListener(socket: Socket) {
    const msgRepo = this.messageRepository;

    socket.on('login', () => {
      Logger.info('User with id is logged in' + socket.id);
    });

    socket.on('message', async ({ id, user, message, socketId }) => {
      Logger.info('Message received from' + socket.id);
      this.users = Object.values(this.users);
      this.users.push(user);

      try {
        const newMessage = new Message();
        newMessage.user = user;
        newMessage.content = message.content;
        newMessage.media = message.media;
        await msgRepo.save(newMessage);
      } catch (e) {
        Logger.error(e);
      }
    });

    socket.on('disconnect', () => {
      Logger.info(socket.id + ' disconnected');
    });
  }
}
