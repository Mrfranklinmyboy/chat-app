import React, { useState } from 'react';

const RoomList = ({ rooms, currentRoom, onSelectRoom, onCreateRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName);
      setNewRoomName('');
    }
  };

  return (
    <div className="room-list">
      <h3>Комнаты</h3>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: currentRoom === room.id ? '#3498db' : 'transparent',
              color: currentRoom === room.id ? 'white' : 'inherit',
              borderRadius: '5px',
              marginBottom: '5px'
            }}
          >
            {room.name}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreateRoom} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Новая комната"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Создать
        </button>
      </form>
    </div>
  );
};

export default RoomList;
