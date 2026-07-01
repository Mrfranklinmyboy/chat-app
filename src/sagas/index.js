import { all, fork } from 'redux-saga/effects';
import { watchSendMessage } from './chatSaga';

export default function* rootSaga() {
  yield all([
    fork(watchSendMessage)
  ]);
}
