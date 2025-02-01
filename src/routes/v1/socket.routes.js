const express = require('express');
const socketRouter = express.Router();

socketRouter.post('/', async (req, res)=>{
    const io = req.app.locals.io;
    const RedisCache = req.app.locals.RedisCache;
    
    const {userId, status} = req.body;
    if(!userId){
        res.status(400).send("Invalid request");
    }

    const socketId = await RedisCache.get(userId);

    if(socketId){
        io.to(socketId).emit('message', status);
        res.send("Status Updated");
    }
    else{
        res.status(404).send("User not Found");
    }
});

module.exports = socketRouter;