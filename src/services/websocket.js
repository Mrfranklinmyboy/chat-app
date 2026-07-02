import { setSocket } from '../sagas/chatSaga';

let socket = null;

export const setupWebSocket = (dispatch, username) => {
  const WS_URL = 'wss://chat-app-p420.onrender.com';
  socket = new WebSocket(WS_URL);
  
  socket.onopen = () => {
    console.log('WebSocket connected');
    setSocket(socket);
    socket.send(JSON.stringify({
      type: 'AUTH',
      payload: { username }
    }));
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket received:', data);
    dispatch(data);
  };
  
  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};

export default setupWebSocket;
