const http = require("http");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');
const socketio = require('socket.io');
const accountSid = 'ACa387520b03e63e6bc68e0e7fe5de016c'
const authToken = '7218bd8f61298f74cacc841110d04987'
const senderNumber = '+14049395920'
const client = new twilio(accountSid, authToken);

//Folder setup
app.use(express.static(__dirname + '/dist/text2team'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const hostname = "10.50.81.110";
const port = 3000;

app.get('/*', (rerq,res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
})

const io = socketio(server);
io.on('connection', (socket) =>{
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})

app.post('/', (req, res) => {
    res.send(req.body);
    console.log(req.body);
    const number = req.body.number;
    const msg = req.body.msg;
    
    client.messages.create({
        from: senderNumber,
        to: number,
        body: msg
  
    })
    .then((message) => console.log(message.sid))
});