import React, { useState, useEffect } from 'react';
import axios from 'axios';
const moment = require('moment');
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const importantUpdate = [
  'invalid',
  'user challenge failed',
  'user out of time',
  'complete',
  'user lost',
  'user challenge success'
]
const ChatSidebar = ({setChatFocused, turnStatus, userLives}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [disableReply, setDisableReply] = useState(false);

  /* * * DELETE MESSAGES FOR NEW GAMES * * */
  useEffect(()=>{
    async function startFresh(){
      await axios.delete('api/messages/all');
    }
    startFresh();
  }, []);

  /* * * * * * * * SHOW OPPONENT THE GAME STATUS * * * * * * * * * */
  useEffect(()=> {
    if(importantUpdate.includes(turnStatus)){
      getOpponentMessage();
    }
  }, [turnStatus])
  /* * * * * * * * * * * SERVER REQUESTS * * * * * * * * * * * * */
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (input.trim() !== '') {
      try {
        await axios.post('/api/messages', {text: input});
        setTimeout(()=> {
          const getAllMessages = async ()=>{
            const {data} = await axios.get('api/messages')
            setMessages(data);
          }
          getAllMessages();
        }, 0)
        getOpponentMessage('Your opponent just posted this message: ' + input);
        setInput('');
      } catch(err) {
        console.warn(err); 
      }
    }
  };

  const handleDelete = async (message) => {
    try{
      await axios.delete(`/api/messages/${message.id}`);
      const {data} = await axios.get('api/messages');
      setMessages(data);
      getOpponentMessage('Your opponent just deleted this message: ' + message);
    } catch(err) {
      console.warn(err); 
    }
  }

  async function getOpponentMessage(message){
    if (disableReply) return;
    setDisableReply(true);
    let update;
    if(message){
      update = message
    } else {
      update = turnStatus
    }
    console.log('userLives', userLives.length);
    try{
      await axios.post('api/messages/update', {update: update, userLives: userLives.length});
      setTimeout(()=> {
        const getAllMessages = async ()=>{
          const {data} = await axios.get('api/messages')
          setMessages(data);
        }
        getAllMessages();
      }, 500)
      setTimeout(() => {
        setDisableReply(false);
      }, 1000);
    } catch(err) {
      console.warn(err);
      setTimeout(() => {
        setDisableReply(false);
      }, 1000);
    }
  }

  /* * * * * * * * * * * HELPER FUNCTIONS * * * * * * * * * * * * */
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  /* * * * * * * * * * * MESSAGE COMPONENT * * * * * * * * * * * * */
  const Message = ({message}) => {
    const {text, username, createdAt} = message;
    const date = moment(`${createdAt}`).format("HH:mm | DD/MM/YYYY");
    return (
      <div className="message-container">
        <div className="message-header">
          <span className="message-userdate">{username} • {date}</span>
          {message.username === 'You' ? (
            <div className="message-actions">
              <button><EditIcon style={{ fontSize: 12 }} /></button>
              <button onClick={()=>handleDelete(message)}><DeleteIcon style={{ fontSize: 12 }} /></button>
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
