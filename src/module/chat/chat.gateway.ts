import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3999, { transports: ['websocket'] })
export class ChatGateway {
  @WebSocketServer()
  io: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { text: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.io.emit('message', {
      name: socket.data.userName,
      text: data.text,
      image: socket.data.userImage,
    });
  }

  @SubscribeMessage('addUser')
  handleAddUser(
    @MessageBody() data: { name: string; image: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.data.userName = data.name;
    socket.data.userImage = data.image;
    this.io.emit('message', {
      name: '系统提示：',
      text: data.name + '加入了房间',
    });
  }

  @SubscribeMessage('removeUser')
  handleRemoveUser(@ConnectedSocket() socket: Socket) {
    this.io.emit('message', {
      name: '系统提示：',
      text: socket.data.userName + '离开了房间',
    });
  }

  // 以下是三个 WebSocketGateway生命周期hook
  afterInit() {
    // console.log('OnGatewayInit');
  }

  handleConnection() {
    // console.log('OnGatewayConnection');
  }

  handleDisconnect() {
    // console.log('OnGatewayDisconnect');
  }
}
