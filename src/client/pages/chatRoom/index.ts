import './index.css';
import { io } from 'socket.io-client';

const url = new URL(location.href);
const userName = url.searchParams.get('userName');
const roomName = url.searchParams.get('roomName');

if (!userName || !roomName) {
  location.href = 'main.html';
}

// 1. create connection -> node server
const clientIo = io();

// 2. the message is from 'join' event on the backend side
clientIo.on('join', (msg) => {
  console.log(msg);
});
