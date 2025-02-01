const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const apiRouter = require('./routes');
const bodyParser = require('body-parser');

const Redis = require('ioredis');
const RedisCache = new Redis();

const dotenv = require('dotenv')
dotenv.config();

const app = express();
app.use(bodyParser.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors : {
        origin : ['http://localhost:5500'],
        methods : ['GET', 'POST'],
    }
});

io.on('connection', (socket)=>{
    socket.on('SetUserId', (UserId)=>{
       console.log(UserId);
       RedisCache.set(UserId, socket.id);
    });

    socket.on('GetSocketId', (UserId)=>{
       RedisCache.get(UserId).then((data)=>{
        console.log(data);
        socket.emit('SocketId', data);
       });
    });
});

app.locals.io = io;
app.locals.RedisCache = RedisCache;

app.use('/api', apiRouter);

httpServer.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on Port: ${process.env.PORT}`);
});