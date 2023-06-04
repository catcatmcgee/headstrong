import React, { useState, useEffect } from 'react';

const ChatSidebar = ({setChatFocused}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-sidebar">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>{message}</p>
            {message.author === 'user' ? (
            <div>
              <button>🖊️</button>
              <button>🗑</button>
            </div>
            ) : null}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control"
          value={newMessage}
          onFocus={()=>setChatFocused(true)}
          onBlur={() => setChatFocused(false)}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatSidebar;
