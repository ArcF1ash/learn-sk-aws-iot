import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

const socket = io('http://localhost:3000');
const messages = writable<{ topic: string; payload: string }[]>([]);

// Update the store as each new MQTT message arrives on the socket
socket.on('mqttMessage', (message) => {
    messages.update((current) => [...current, message]);
});

export { messages };