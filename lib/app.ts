import express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log('Server port: ', PORT);
});

const io = require('socket.io')(server);
const connectedUser = new Set();


var room = "";



io.on('connection', (socket) => {
 
    console.log("Connected: ", socket.id);
       
    connectedUser.add(socket.id);
        app.get('/:room', (req, res) => {
            room = req.params.room;
            // Realizar cualquier acción necesaria con el nombre de la sala
            res.send(`Joining room: ${room}`);
        });
    socket.join(room, () => {    
        console.log(`Socket ${socket.id} joining ${room}`);
    });

    socket.on('disconect', () => {
        console.log("Disconnected: ", socket.id);
        connectedUser.delete(socket.id);
        io.emit('connected-user', connectedUser.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        console.log('estas enviado este mensaje a:', socket.room,data);
        socket.to(room).emit('message-receive', data);
        
        //socket.broadcast.emit('message-receive', data);
    });
});

