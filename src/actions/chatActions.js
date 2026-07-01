import * as types from './ActionTypes';

export const addMessage = (message) => ({
  type: types.ADD_MESSAGE,
  payload: message
});

export const addUser = (username) => ({
  type: types.ADD_USER,
  payload: username
});

export const sendMessage = (text, author) => ({
  type: types.SEND_MESSAGE,
  payload: { text, author, timestamp: new Date().toISOString() }
});

export const userConnected = (username) => ({
  type: types.USER_CONNECTED,
  payload: username
});

export const userDisconnected = (username) => ({
  type: types.USER_DISCONNECTED,
  payload: username
});
