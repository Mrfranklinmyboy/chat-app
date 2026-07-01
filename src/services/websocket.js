import { setSocket } from '../sagas/chatSaga';

let socket = null;

export const setupWebSocket = (dispatch, username) => {
  socket = new WebSocket('ws://localhost:8080');
  
  socket.onopen = () => {
    console.log('WebSocket connected');
    setSocket(socket);
    socket.send(JSON.stringify({
      type: 'ADD_USER',
      payload: username
    }));
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dispatch(data);
  };
  
  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return socket;
};
