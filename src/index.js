import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { addUser, authSuccess } from './actions/chatActions';
import { setupWebSocket } from './services/websocket';
import { generateUsername } from './utils/nameGenerator';
import App from './components/App';

const store = configureStore();

// Проверяем есть ли сохранённый пользователь
const savedUsername = localStorage.getItem('username');
const savedToken = localStorage.getItem('token');

if (savedUsername && savedToken) {
  store.dispatch(authSuccess(savedUsername));
}

const username = savedUsername || generateUsername();
store.dispatch(addUser(username));

// Настраиваем WebSocket
setupWebSocket(store.dispatch, username);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
