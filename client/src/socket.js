import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // use your deployed URL if needed
export default socket;