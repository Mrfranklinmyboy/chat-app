const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 3001;

// API: Регистрация
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// API: Вход
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(400).json({ error: 'User not found' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid password' });
  
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token, username });
});

// API: Получить комнаты
app.get('/api/rooms', (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms').all();
  res.json(rooms);
});

// API: Создать комнату
app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare('INSERT INTO rooms (name) VALUES (?)');
  stmt.run(name);
  const room = db.prepare('SELECT * FROM rooms WHERE name = ?').get(name);
  res.json(room);
});

// API: Получить сообщения комнаты
app.get('/api/rooms/:roomId/messages', (req, res) => {
  const messages = db.prepare(`
    SELECT m.*, u.username as author 
    FROM messages m 
    JOIN users u ON m.author = u.username 
    WHERE m.room_id = ? 
    ORDER BY m.created_at ASC 
    LIMIT 50
  `).all(req.params.roomId);
  res.json(messages);
});

// Запуск HTTP сервера
const server = app.listen(PORT, () => {
  console.log(`REST API running on port ${PORT}`);
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });
let users = {};
let currentRooms = {};

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'AUTH') {
      users[ws] = data.payload.username;
    }

    if (data.type === 'JOIN_ROOM') {
      currentRooms[ws] = data.payload;
      const messages = db.prepare('SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC LIMIT 50').all(data.payload);
      messages.forEach(msg => {
        ws.send(JSON.stringify({ type: 'ADD_MESSAGE', payload: msg }));
      });
    }

    if (data.type === 'SEND_MESSAGE') {
      const roomId = currentRooms[ws];
      const currentUser = users[ws];
      if (roomId && currentUser) {
        const stmt = db.prepare('INSERT INTO messages (room_id, author, text) VALUES (?, ?, ?)');
        stmt.run(roomId, currentUser, data.payload.text);
        const newMessage = {
          id: db.prepare('SELECT last_insert_rowid() as id').get().id,
          room_id: roomId,
          author: currentUser,
          text: data.payload.text,
          created_at: new Date().toISOString()
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && currentRooms[client] === roomId) {
            client.send(JSON.stringify({ type: 'ADD_MESSAGE', payload: newMessage }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    delete users[ws];
    delete currentRooms[ws];
  });
});

console.log('Server started');
