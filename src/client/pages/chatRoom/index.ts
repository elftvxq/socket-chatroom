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

const textInput = document.getElementById('textInput') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const chatBoard = document.getElementById('chatBoard') as HTMLDivElement;
const headerRoomName = document.getElementById(
  'headerRoomName'
) as HTMLParagraphElement;
const backBtn = document.getElementById('backBtn') as HTMLButtonElement;

headerRoomName.textContent = roomName || '-';

function createMessage(msg: string) {
  const message = document.createElement('div');
  message.classList.add('flex', 'justify-end', 'items-end', 'mb-4');
  message.innerHTML = `
  <p class="text-xs text-gray-700 mr-4">00:00</p>

  <div>
    <p class="text-xs text-white mb-1 text-right">Emma</p>
    <p
      class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
    >
      ${msg}
    </p>
  </div>`;
  chatBoard.appendChild(message);
  // clear input after submit message
  textInput.value = '';
  // scroll to bottom
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
  console.log(msg);
});

clientIo.on('chat', (msg) => {
  createMessage(msg);
});
