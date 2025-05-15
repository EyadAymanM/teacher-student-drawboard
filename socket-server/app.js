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
  // console.log(`user ${socket.id.slice(0, 6)} connected`)
  // handleSocket(socket,io)

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
  });

  socket.on('draw:start', (coords,boardId, settings) => {
    // console.log(coords);
    io.to(boardId).emit('draw:start', coords, settings)
  })

  socket.on('draw:stop', (state,boardId, settings) => {
    io.to(boardId).emit('draw:stop', state, settings)
  })

  socket.on('drawing', (coords,boardId, settings) => {
    io.to(boardId).emit('drawing', coords, settings)
  })

});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});