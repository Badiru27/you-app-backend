import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
import { User } from 'src/types/user';
import { WsGuard } from '../auth/guard/ws.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id},`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomName?: string },
  ) {
    const user = client['user'] as User;

    const roomId = await this.chatService.createRoom({
      createdBy: user.id,
      name: body.roomName,
    });
    client.join(roomId);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() { roomId }: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['user'] as User;
    await this.chatService.joinRoom(roomId, user.id);
    client.join(roomId);
    this.server.to(roomId).emit('userJoined', { userId: user.id, roomId });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() { roomId, message }: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client['user'] as User;
    await this.chatService.createMessage(roomId, user.id, message);
    this.server.to(roomId).emit('newMessage', { roomId, sender: user.id });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('identify')
  async identifyUser(@ConnectedSocket() client: Socket) {
    const user = client['user'] as User;

    const userRooms = await this.chatService.getUserRooms(user.id);

    for (const room of userRooms) {
      client.join(room.roomId);
    }
  }
}
