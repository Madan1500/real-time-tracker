import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('sendLocation', (data) => {
        io.emit('receiveLocation', {id: socket.id, ...data});
    });

    console.log('A user connected');
    socket.on('disconnect', () => {
        io.emit('userDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.render('index');
});

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});