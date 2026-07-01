import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import chatReducer from '../reducers/chatReducer';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const store = createStore(
    chatReducer,
    applyMiddleware(sagaMiddleware)
  );
  
  sagaMiddleware.run(rootSaga);
  
  return store;
};

export default configureStore;
