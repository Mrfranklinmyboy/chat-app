import React from 'react';

const Sidebar = ({ users }) => {
  return (
    <div className="sidebar">
      <h3>Пользователи онлайн</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
