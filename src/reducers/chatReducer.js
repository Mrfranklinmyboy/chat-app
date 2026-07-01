import * as types from '../actions/ActionTypes';

const initialState = {
  messages: [],
  users: []
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case types.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case types.USER_CONNECTED:
      return {
        ...state,
        users: [...state.users.filter(u => u !== action.payload), action.payload]
      };
    case types.USER_DISCONNECTED:
      return {
        ...state,
        users: state.users.filter(u => u !== action.payload)
      };
    default:
      return state;
  }
};

export default chatReducer;
