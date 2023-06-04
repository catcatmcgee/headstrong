import React, { useState, useEffect } from 'react';
import axios from 'axios';
const moment = require('moment');

const ChatSidebar = ({setChatFocused}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  /* * * * * * * * * * * SERVER REQUESTS * * * * * * * * * * * * */
  
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (input.trim() !== '') {
      try {
        await axios.post('/api/messages', {text: input});
        const {data} = await axios.get('api/messages');
        setMessages(data);
      } catch(err) {
        console.warn(err); 
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      await axios.delete(`/api/messages/${id}`);
      const {data} = await axios.get('api/messages');
      setMessages(data);
    } catch(err) {
      console.warn(err); 
    }
  }
  
  useEffect(()=>{
    async function test(){
      const {data} = await axios.get('api/messages');
      console.log('messages?', data)
      setMessages(data);
    }
    test();
  }, []);
  /* * * * * * * * * * * HELPER FUNCTIONS * * * * * * * * * * * * */
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  /* * * * * * * * * * * MESSAGE COMPONENT * * * * * * * * * * * * */
  const Message = ({message}) => {
    const {text, id, username, createdAt} = message;
    const date = moment("2023-06-04T22:48:07.000Z").format("HH:mm | DD/MM/YYYY");
    console.log('text, username, createdAt', text, username, createdAt)
    return (
      <div className="message-container">
        <div className="message-header">
          <span className="message-userdate">{username} • {date}</span>
          {message.username === 'You' ? (
            <div className="message-actions">
              <button>🖊️</button>
              <button onClick={()=>handleDelete(id)}>🗑</button>
            </div>
          ) : null }
        </div>
        <div className="message-box">
          {text}
        </div>
      </div>
    )
  }

  return (
    <div className="chat-sidebar">
      <div className="messages">
        {messages.length ? (
          messages.map((message) => <Message key={message.id} message={message} />)
        ) : null}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control"
          value={input}
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
