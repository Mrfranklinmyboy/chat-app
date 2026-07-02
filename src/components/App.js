import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SidebarContainer from './SidebarContainer';
import MessagesListContainer from './MessagesListContainer';
import AddMessageContainer from './AddMessageContainer';
import Auth from './Auth';
import RoomList from './RoomList';
import { authSuccess, setRooms, joinRoom, addRoom } from '../actions/chatActions';
import './App.css';

const API_URL = 'https://chat-app-p420.onrender.com';

const App = ({ currentUser, currentRoom, rooms, authSuccess, setRooms, joinRoom, addRoom }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL + '/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setIsLoading(false);
        if (data.length > 0 && !currentRoom) {
          joinRoom(data[0].id);
        }
      })
      .catch(err => {
        console.error('Error loading rooms:', err);
        setIsLoading(false);
      });
  }, [setRooms, currentRoom, joinRoom]);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch(API_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        authSuccess(data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      } else {
        alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка входа: ' + error.message);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const res = await fetch(API_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        authSuccess(data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
      } else {
        alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      alert('Ошибка регистрации: ' + error.message);
    }
  };

  const handleCreateRoom = async (name) => {
    try {
      const res = await fetch(API_URL + '/api/rooms', {
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