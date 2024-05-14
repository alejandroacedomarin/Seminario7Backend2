import express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT,()=>{
    console.log('Server port: ',PORT);
});
const io = require('socket.io')(server);
const connectedUser= new Set();


io.on('connection',(socket)=>{
    
    socket.join("room1");
    console.log("Connected: ",socket.id, socket.rooms);
    connectedUser.add(socket.id);
    io.to("room1").emit('connected-user', connectedUser.size);
    socket.on('disconect',()=>{
        console.log("Disconnected: ", socket.id);
        connectedUser.delete(socket.id);
        io.emit('connected-user', connectedUser.size);
    });
    socket.on('message', (data)=>{
        console.log(data);
        console.log('estas enviando este mensaje a:',socket.rooms, data);
        //socket.broadcast.emit('message-receive', data);
        socket.to("room1").emit('message-receive', data);
    });
});
