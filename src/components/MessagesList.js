import React from 'react';
import Message from './Message';

const MessagesList = ({ messages }) => {
  return (
    <div className="messages-list">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
    </div>
  );
};

export default MessagesList;
