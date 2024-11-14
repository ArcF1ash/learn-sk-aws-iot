import { io, Socket } from 'socket.io-client';

export const connectToSocketIO = (onMessage: (message: string) => void): Socket => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => console.log('Connected to backend'));
    socket.on('data', (message: string) => onMessage(message));
    socket.on('disconnect', () => console.log('Disconnected from backend'));

    return socket;
}