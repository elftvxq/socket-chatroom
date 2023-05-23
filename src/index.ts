import devServer from '@/server/dev';
import prodServer from '@/server/prod';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserService from '@/services/UserService';

import { name } from '@/utils';

const port = 3000;
const app = express();
const server = http.createServer(app);
// implement socket.io by http server
const io = new Server(server);
const userService = new UserService();

// backend side create socket.io, listen to connection event
io.on('connection', (socket) => {
  // create a channel which is called 'join', and listen to it on the frontend side
  // then send message to join channel
  socket.emit('join', 'Welcome to chatroom');

  socket.on('chat', (msg) => {
    io.emit('chat', msg);
  });
});

// 執行 npm run dev 本地開發 or 執行 npm run start 部署後啟動線上伺服器
if (process.env.NODE_ENV === 'development') {
  devServer(app);
} else {
  prodServer(app);
}

console.log('server side', name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
