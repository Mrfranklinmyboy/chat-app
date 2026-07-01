import { connect } from 'react-redux';
import { sendMessage } from '../actions/chatActions';
import AddMessage from './AddMessage';

const mapDispatchToProps = (dispatch) => ({
  onSendMessage: (text) => {
    dispatch(sendMessage(text, 'Я'));
  }
});

export default connect(null, mapDispatchToProps)(AddMessage);
