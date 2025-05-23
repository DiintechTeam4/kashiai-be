const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Your Express setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // update in production
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🔌 A client connected:', socket.id);

  socket.on('joinRoom', ({ roomId, role, userId }) => {
    const resolvedUserId = userId && userId == 'userid' ? socket.id : userId;

    socket.join(roomId);
    socket.data = { role, userId: resolvedUserId, roomId };

    console.log(`📥 ${role} (${resolvedUserId}) joined room: ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    console.log(`📤 Message from ${data.sender} in room ${data.room}: ${data.text}`);
    io.to(data.room).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.data?.role || 'unknown'} disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
