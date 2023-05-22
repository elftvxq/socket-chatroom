import './index.css';
import { name } from '@/utils';
import { io } from 'socket.io-client';

console.log('client side chatroom page', name);

// 1. create connection -> node server
const clientIo = io();

// 2. the message is from 'join' event on the backend side
clientIo.on('join', (msg) => {
  console.log(msg);
});
