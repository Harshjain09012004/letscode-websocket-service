const express = require('express');
const v1Router = express.Router();

const socketRouter = require('./socket.routes');

v1Router.use('/sendPayload', socketRouter);

module.exports = v1Router;