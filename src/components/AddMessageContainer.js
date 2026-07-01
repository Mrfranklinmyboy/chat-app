import { connect } from 'react-redux';
import { sendMessage } from '../actions/chatActions';
import AddMessage from './AddMessage';

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  currentRoom: state.currentRoom
});

const mapDispatchToProps = (dispatch) => ({
  onSendMessage: (text) => {
    dispatch(sendMessage(text, 'Я'));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMessage);
