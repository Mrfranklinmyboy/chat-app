import { all, fork } from 'redux-saga/effects';
import { watchSendMessage, watchJoinRoom } from './chatSaga';

export default function* rootSaga() {
  yield all([
    fork(watchSendMessage),
    fork(watchJoinRoom)
  ]);
}
