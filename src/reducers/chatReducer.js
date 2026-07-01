import * as types from '../actions/ActionTypes';

const initialState = {
  messages: [],
  users: [],
  rooms: [],
  currentRoom: null,
  currentUser: null
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
    case types.AUTH_SUCCESS:
      return {
        ...state,
        currentUser: action.payload
      };
    case types.JOIN_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
        messages: [] // Очищаем сообщения при смене комнаты
      };
    case types.SET_ROOMS:
      return {
        ...state,
        rooms: action.payload
      };
    case types.ADD_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, action.payload]
      };
    default:
      return state;
  }
};

export default chatReducer;
