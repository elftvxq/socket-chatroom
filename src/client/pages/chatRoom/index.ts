import './index.css';
import { io } from 'socket.io-client';
import { UserData } from '@/service/UserService';

type UserMsg = { userData: UserData; msg: string; time: number };

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
let userID = '';

function createMessage(data: UserMsg) {
  const date = new Date(data.time);
  const time = `${date.getHours()}:${date.getMinutes()}`;

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('flex', 'items-end', 'mb-4');

  if (data.userData.id === userID) {
    messageDiv.classList.add('justify-end');
    messageDiv.innerHTML = `
        <p class="text-xs text-gray-500 mr-4">${time}</p>
        <div>
            <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
            <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
                ${data.msg}
            </p>
        </div>`;
  } else {
    messageDiv.classList.add('justify-start');
    messageDiv.innerHTML = `
        <div>
            <p class="text-xs text-gray-500 mb-1">${data.userData.userName}</p>
            <p
              class="mx-w-[50%] break-all bg-gray-600 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white">
              ${data.msg}
            </p>
          </div>
          <p class="text-xs text-gray-700 ml-4">${time}</p>`;
  }

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
  roomMessage(msg);
});

clientIo.on('chat', (data: UserMsg) => {
  createMessage(data);
});

clientIo.on('leave', (msg) => {
  roomMessage(msg);
});

clientIo.on('userID', (id) => {
  userID = id;
});
