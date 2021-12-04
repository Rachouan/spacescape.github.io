const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

var clients = []

io.on('connection', (socket) => {
    console.log(socket)
    console.log('A user just connected.');
    clients[socket.id] = {id:socket.id};
    socket.on('disconnect', (socket) => {
        delete clients[socket.id]
        console.log('A user has disconnected.');
    })
    socket.on('updatePosition', (client) => {
        io.emit('updatedPosition', client);
    })
    socket.on('newPlayer', (player) => {
        clients.push(player)
    })
    io.emit('socketClientID', {id:socket.id,clients:clients});
});