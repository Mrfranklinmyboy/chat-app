import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../actions/ActionTypes';

let socket = null;

export function setSocket(ws) {
  socket = ws;
}

function* sendMessageSaga(action) {
  console.log('Saga: sending message', action);
  if (socket && socket.readyState === WebSocket.OPEN) {
    yield call([socket, socket.send], JSON.stringify(action));
    console.log('Saga: message sent');
  } else {
    console.error('Saga: socket not ready');
  }
}

function* joinRoomSaga(action) {
  console.log('Saga: joining room', action);
  if (socket && socket.readyState === WebSocket.OPEN) {
    yield call([socket, socket.send], JSON.stringify(action));
    console.log('Saga: joined room');
  }
}

export function* watchSendMessage() {
  yield takeEvery(types.SEND_MESSAGE, sendMessageSaga);
}

export function* watchJoinRoom() {
  yield takeEvery(types.JOIN_ROOM, joinRoomSaga);
}
