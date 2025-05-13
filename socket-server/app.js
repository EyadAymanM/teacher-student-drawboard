import { Server } from 'socket.io';
import http from 'http';
// import handleSocket from './sockets/index.js';

const PORT = 3003;

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

io.on('connection', socket => {
  console.log(`user ${socket.id.slice(0, 6)} connected`)
  // handleSocket(socket,io)
  socket.on('draw:start', (coords) => {
    // console.log(coords);
    io.emit('draw:start', coords)
  })

  socket.on('draw:stop', (state) => {
    io.emit('draw:stop', state)
  })

  socket.on('drawing', (coords) => {
    io.emit('drawing', coords)
  })

});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});