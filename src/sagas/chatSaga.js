import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../actions/ActionTypes';

let socket = null;

export function setSocket(ws) {
  socket = ws;
}

function* sendMessageSaga(action) {
  console.log('Saga: sending message', action.payload);
  if (socket && socket.readyState === WebSocket.OPEN) {
    yield call([socket, socket.send], JSON.stringify(action));
    console.log('Saga: message sent');
  } else {
    console.log('Saga: socket not open', socket?.readyState);
  }
}

export function* watchSendMessage() {
  yield takeEvery(types.SEND_MESSAGE, sendMessageSaga);
}
