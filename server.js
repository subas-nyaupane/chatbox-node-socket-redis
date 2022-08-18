var express = require('express');
const app = require('express')();
const port = 3000;
var mongoose = require('mongoose');
var cors = require('cors');
app.use(cors());


// const httpServer = require('http').createServer(app);
// const {Server} = require("socket.io");  //socket.io ver 4.4.3
// const io = new Server(httpServer, {
//     path:'/socket.io/socket.io.js',
//   transports: ["websocket"],
  
// });
const { createServer }  = require('http');
const { Server } = require('socket.io');
const io = new Server(server, {
    cors:{
      origin:'*',
    }
  });
  io.on('connection', socket => {
    console.log('Conection to socket.io');
    socket.on('message', ({ name, message }) => {
      io.emit('message', { name, message })
    })
  });

// var server  = app.listen();
// var io      = require('socket.io')(server);

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); //The ionic server
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

app.use(express.static(__dirname));

io.on('connection', () =>{
    console.log('a user is connected')
  })



// const hostname = 'http://127.0.0.1';
// const port = 3000;

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb+srv://subas:subas@chat-app.xnhx3c1.mongodb.net/chat-app';



mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
})


io.on('connection', () =>{
    console.log('a user is connected')
})


var Message = mongoose.model('Message',{ name : String, message : String});

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
        sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});