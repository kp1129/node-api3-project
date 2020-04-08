const express = require('express');
const userRouter = require('./users/userRouter');
const server = express();


server.use(express.json());
server.use(logger);
server.use("/users", userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware

function logger(req, res, next) {
  let current_time = new Date();
  let time = current_time.getHours() + ":" + current_time.getMinutes();
  console.log(`${req.method} request to ${req.originalUrl} at ${time}`)
  next();
}

module.exports = server;
