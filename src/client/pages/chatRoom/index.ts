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
// pop up welcome message when join channel
// send data when users join the chatroom
clientIo.emit('join', { userName, roomName });

const textInput = document.getElementById('textInput') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const chatBoard = document.getElementById('chatBoard') as HTMLDivElement;
const headerRoomName = document.getElementById(
  'headerRoomName'
) as HTMLParagraphElement;
const backBtn = document.getElementById('backBtn') as HTMLButtonElement;

headerRoomName.textContent = roomName || '-';

function createMessage(msg: string) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('flex', 'justify-end', 'items-end', 'mb-4');
  messageDiv.innerHTML = `
  <p class="text-xs text-gray-700 mr-4">00:00</p>

  <div>
    <p class="text-xs text-white mb-1 text-right">Emma</p>
    <p
      class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
    >
      ${msg}
    </p>
  </div>`;
  chatBoard.appendChild(messageDiv);
  // clear input after submit message
  textInput.value = '';
  // scroll to bottom
  chatBoard.scrollTop = chatBoard.scrollHeight;
}

function roomMessage(msg: string) {
  const welcomeMessageDiv = document.createElement('div');
  welcomeMessageDiv.classList.add(
    'flex',
    'justify-center',
    'items-center',
    'mb-4'
  );
  welcomeMessageDiv.innerHTML = `
     <p class="text-gray-700 text-sm">${msg}</p>`;

  chatBoard.appendChild(welcomeMessageDiv);
  // clear input after submit message
  chatBoard.scrollTop = chatBoard.scrollHeight;
}

submitBtn.addEventListener('click', () => {
  const textValue = textInput.value;

  // 2. send text message to chat event (channel)
  clientIo.emit('chat', textValue);
});

backBtn.addEventListener('click', () => {
  location.href = '/main/main.html';
});

clientIo.on('join', (msg) => {
  console.log('🚀 ~ file: index.ts:60 ~ clientIo.on ~ msg:', msg);
  roomMessage(msg);
});

clientIo.on('chat', (msg) => {
  createMessage(msg);
});

clientIo.on('leave', (msg) => {
  roomMessage(msg);
});
