import devServer from '@/server/dev';
import prodServer from '@/server/prod';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserService from '@/service/UserService';
import moment from 'moment';

const port = 3000;
const app = express();
const server = http.createServer(app);
// implement socket.io by http server
const io = new Server(server);
const userService = new UserService();

// backend side create socket.io, listen to connection event
io.on('connection', (socket) => {
  socket.emit('userID', socket.id);

  socket.on(
    'join',
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      const userData = userService.userDataInfoHandler(
        socket.id,
        userName,
        roomName
      );

      socket.join(userData.roomName);

      userService.addUser(userData);

      // use socekt broadcase to send message to the users in the same room
      socket.broadcast
        .to(userData.roomName)
        .emit('join', `${userName} has joined the ${roomName}`);
    }
  );

  socket.on('chat', (msg) => {
    const time = moment.utc();
    const userData = userService.getUser(socket.id);
    // send message to the users in the same room
    if (userData) {
      io.to(userData.roomName).emit('chat', { userData, msg, time });
    }
  });

  socket.on('disconnect', () => {
    const userData = userService.getUser(socket.id);
    const userName = userData?.userName;
    if (userName) {
      socket.broadcast
        .to(userData.roomName)
        .emit('leave', `${userData.userName} has left the chat`);
    }

    userService.removeUser(socket.id);
  });
});

// 執行 npm run dev 本地開發 or 執行 npm run start 部署後啟動線上伺服器
if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
