import { connect } from 'react-redux';
import Sidebar from './Sidebar';

const mapStateToProps = (state) => ({
  users: state.users
});

export default connect(mapStateToProps)(Sidebar);
