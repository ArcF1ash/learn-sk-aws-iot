//import config from './config';
//import connectAndSubscribe from './client';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Create an http server and wrap it with Socket.IO
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: '*'}
});

// When a client connects
io.on('connection', (socket) => {
    console.log('New client connected');

    // When client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })
})

// Start the server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})

//connectAndSubscribe(config.AWS_ENDPOINT,config.AWS_CERT_PATH,config.AWS_KEY_PATH, config.AWS_IOT_TOPIC);