require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const mqttClient = require('./mqtt');              // ← import the shared client

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Bridge MQTT → Socket.IO
mqttClient.on('message', (topic, message) => {
  if (topic === 'tasks/updates') {
    const data = JSON.parse(message.toString());
    console.log('📨 MQTT → Socket.IO:', data);
    io.emit('taskUpdated', data);
  }
});

// Optional: confirm Socket.IO connections
io.on('connection', (socket) => {
  console.log('🕸️  WebSocket connected:', socket.id);
  socket.on('disconnect', () => console.log('🕸️  WebSocket disconnected:', socket.id));
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Real-Time Task Manager API running'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server listening on :${PORT}`));
