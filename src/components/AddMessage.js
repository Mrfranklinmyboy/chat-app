import React, { useState } from 'react';

const AddMessage = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="add-message">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите сообщение..."
      />
    </div>
  );
};

export default AddMessage;
