import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SidebarContainer from './SidebarContainer';
import MessagesListContainer from './MessagesListContainer';
import AddMessageContainer from './AddMessageContainer';
import Auth from './Auth';
import RoomList from './RoomList';
import { authSuccess, setRooms, joinRoom, addRoom } from '../actions/chatActions';
import './App.css';

const App = ({ currentUser, currentRoom, rooms, authSuccess, setRooms, joinRoom, addRoom }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загружаем комнаты при старте
    fetch('http://localhost:3001/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading rooms:', err);
        setIsLoading(false);
      });
  }, [setRooms]);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        authSuccess(data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      }
    } catch (error) {
      alert('Ошибка входа');
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        authSuccess(data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      }
    } catch (error) {
      alert('Ошибка регистрации');
    }
  };

  const handleCreateRoom = async (name) => {
    try {
      const res = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      addRoom(data);
    } catch (error) {
      alert('Ошибка создания комнаты');
    }
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <RoomList 
          rooms={rooms}
          currentRoom={currentRoom}
          onSelectRoom={joinRoom}
          onCreateRoom={handleCreateRoom}
        />
        <SidebarContainer />
      </div>
      <div className="main-content">
        <MessagesListContainer />
        <AddMessageContainer />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  currentRoom: state.currentRoom,
  rooms: state.rooms
});

const mapDispatchToProps = {
  authSuccess,
  setRooms,
  joinRoom,
  addRoom
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
