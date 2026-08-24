import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// Discovery Routes
app.get('/api/discover', (req, res) => {
  res.json({ message: 'Get nearby singles' });
});

// Match Routes
app.post('/api/swipe', (req, res) => {
  res.json({ message: 'Record swipe' });
});

app.get('/api/matches', (req, res) => {
  res.json({ message: 'Get matches' });
});

// Messaging Routes
app.get('/api/messages/:matchId', (req, res) => {
  res.json({ message: 'Get messages for match' });
});

app.post('/api/messages', (req, res) => {
  res.json({ message: 'Send message' });
});

// User Profile Routes
app.get('/api/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

app.put('/api/profile', (req, res) => {
  res.json({ message: 'Update profile' });
});

app.post('/api/profile/photos', (req, res) => {
  res.json({ message: 'Upload photo' });
});

app.post('/api/verify', (req, res) => {
  res.json({ message: 'Verify profile' });
});

// Block/Report Routes
app.post('/api/block', (req, res) => {
  res.json({ message: 'Block user' });
});

app.post('/api/report', (req, res) => {
  res.json({ message: 'Report user' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (matchId) => {
    socket.join(`match-${matchId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`match-${data.matchId}`).emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Casual Connect Server running on http://localhost:${PORT}`);
});
