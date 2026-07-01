import React from 'react';
import SidebarContainer from './SidebarContainer';
import MessagesListContainer from './MessagesListContainer';
import AddMessageContainer from './AddMessageContainer';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <SidebarContainer />
      <div className="main-content">
        <MessagesListContainer />
        <AddMessageContainer />
      </div>
    </div>
  );
};

export default App;
