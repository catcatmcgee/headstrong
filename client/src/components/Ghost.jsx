import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

const Ghost = () => {

  const [userMove, setUserMove] = useState('');
  const [game, setGame] = useState('');
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const input = (e.target.value);
    setUserMove(input.slice(-1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/ghost', {game: game + userMove});
      if(data === 'odd'){
        setGame(game + userMove);
        setStatus('complete');
      } else if (data === 'even') {
        setGame(game + userMove + `\nwowwwww I didn't know we allowed cheaters to play. Okay cheater, next game.`)
        setStatus('cheated');
      } else if (data === '') {
        setGame(game + userMove);
        setStatus('invalid')
      } else {
      setGame(game + userMove + data);
      }
      setUserMove('');
    } catch(err) {
      console.warn(err);
    }
  };

  const handleReset = () => {
    setUserMove('')
    setGame('')
    setStatus('')
  }
  
  return (
    <div className="text wrap">
      <form>
        <h2 className="title">Play a game of ghost?</h2>
        <br />
        <div className="rules">The rules are simple. We each have five lives, one for each letter of the word "GHOST." You play a letter, then I play a letter. If the letter you play complete's a word, you loose a life. If the letter you play can't lead to any possible word, you loose a life. To make it fair, I'll tell you that we're using Meriam Webster's college dictionary as a word source. Here, I'll even let you go first.</div>
        <br />
        <div>
          <textarea className="form-control"
            placeholder="Give your post a userMove"
            value={userMove}
            onChange={(e) => handleChange(e, setUserMove)}/>
        </div>
        <button className="urlButton" onClick={handleSubmit}>Submit</button>
        <h2 className="game">Current Game: {game}</h2>
        {status === 'complete' ? (
          <h1>YOU IDIOT, YOU FINISHED A WORD</h1>
        ) : status === 'cheated' ? (
          <h1>YOU'RE A CHEARER</h1>
        ) : status === 'invalid' ? (
          <h1>THATS NOT A WORD, STUPID</h1>
        ) : null }
        {status.length ? (
          <button className="urlButton" onClick={handleReset}>Try Again</button>
        ) : null}
      </form>
    </div>
  );
};

export default Ghost;
