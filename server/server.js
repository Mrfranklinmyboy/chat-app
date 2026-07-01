const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key-change-in-production';

// API: Регистрация
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token, username });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API: Вход
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username });
  });
});

// API: Получить комнаты
app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', [], (err, rooms) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rooms);
  });
});

// API: Создать комнату
app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO rooms (name) VALUES (?)', [name], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Room already exists' });
    }
    res.json({ id: this.lastID, name });
  });
});

// API: Получить сообщения комнаты
app.get('/api/rooms/:roomId/messages', (req, res) => {
  const roomId = req.params.roomId;
  db.all(`SELECT m.*, u.username as author 
          FROM messages m 
          JOIN users u ON m.author = u.username 
          WHERE m.room_id = ? 
          ORDER BY m.created_at ASC 
          LIMIT 50`, 
    [roomId], 
    (err, messages) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(messages);
    }
  );
});

const server = app.listen(3001, () => {
  console.log('REST API running on http://localhost:3001');
});

// WebSocket сервер
const wss = new WebSocket.Server({ port: 8080 });
let users = {}; // ws -> username
let currentRooms = {}; // ws -> roomId

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'AUTH') {
      const username = data.payload.username;
      users[ws] = username;
      console.log('User authenticated:', username);
      
      // Отправляем список пользователей
      const userList = Object.values(users);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          userList.forEach(user => {
            client.send(JSON.stringify({
              type: 'USER_CONNECTED',
              payload: user
            }));
          });
        }
      });
    }

    if (data.type === 'JOIN_ROOM') {
      const roomId = data.payload;
      currentRooms[ws] = roomId;
      console.log('User joined room:', roomId);
      
      // Отправляем историю сообщений
      db.all(`SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC LIMIT 50`, 
        [roomId], 
        (err, messages) => {
          if (!err && messages && ws.readyState === WebSocket.OPEN) {
            messages.forEach(msg => {
              ws.send(JSON.stringify({
                type: 'ADD_MESSAGE',
                payload: msg
              }));
            });
          }
        }
      );
    }

    if (data.type === 'SEND_MESSAGE') {
      const roomId = currentRooms[ws];
      const currentUser = users[ws];
      
      console.log('Sending message:', { roomId, currentUser, payload: data.payload });
      
      if (roomId && currentUser) {
        // Сохраняем в БД
        db.run(
          'INSERT INTO messages (room_id, author, text) VALUES (?, ?, ?)',
          [roomId, currentUser, data.payload.text],
          function(err) {
            if (!err) {
              const newMessage = {
                id: this.lastID,
                room_id: roomId,
                author: currentUser,
                text: data.payload.text,
                created_at: new Date().toISOString()
              };

              console.log('Message saved, broadcasting to room:', roomId);

              // Отправляем всем в комнате
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && 
                    currentRooms[client] === roomId) {
                  console.log('Sending to client');
                  client.send(JSON.stringify({
                    type: 'ADD_MESSAGE',
                    payload: newMessage
                  }));
                }
              });
            } else {
              console.error('Error saving message:', err);
            }
          }
        );
      } else {
        console.log('Missing roomId or currentUser:', { roomId, currentUser });
      }
    }
  });

  ws.on('close', () => {
    const username = users[ws];
    if (username) {
      delete users[ws];
      delete currentRooms[ws];
      console.log('User disconnected:', username);
      
      // Уведомляем остальных
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'USER_DISCONNECTED',
            payload: username
          }));
        }
      });
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');
