const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);
    
    if (data.type === 'ADD_USER') {
      const username = data.payload;
      if (!users.includes(username)) {
        users.push(username);
      }
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'USER_CONNECTED',
            payload: username
          }));
        }
      });
    } else if (data.type === 'SEND_MESSAGE') {
      // Отправляем сообщение всем клиентам
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'ADD_MESSAGE',
            payload: data.payload  // ИСПРАВЛЕНО: отправляем payload, а не весь data
          }));
        }
      });
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');
