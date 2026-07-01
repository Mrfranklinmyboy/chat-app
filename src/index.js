import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { addUser } from './actions/chatActions';
import { setupWebSocket } from './services/websocket';
import { generateUsername } from './utils/nameGenerator';
import App from './components/App';

const store = configureStore();
const username = generateUsername();

store.dispatch(addUser(username));
setupWebSocket(store.dispatch, username);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
