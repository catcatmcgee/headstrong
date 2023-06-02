import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ghost = () => {

  const [userMove, setUserMove] = useState('');
  const [game, setGame] = useState('');
  const [status, setStatus] = useState('pregame');
  const [userLives, setUserLives] = useState('GHOST');
  const [computerLives, setComputerLives] = useState('GHOST');

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();

    if(!status.length){
      try {
        console.log(userMove)
        const { data } = await axios.post('/api/ghost', {game: (game + userMove).toLowerCase()});
        if (data.end === 'odd') {
          setGame(game + userMove);
          setTimeout(() => {setStatus('complete');
          setUserLives(userLives.slice(0,-1))}, 1000)
        } else if (data.end === 'even') {
          setGame(game + userMove + data.letter);
          setTimeout(() => {setStatus('cheated');
          setComputerLives(computerLives.slice(0,-1))}, 1000)
        } else if (data === '') {
          setGame(game + userMove);
          setTimeout(() => {setStatus('invalid');
          setUserLives(userLives.slice(0,-1))}, 1000)
        } else {
        setGame(game + userMove);
        setTimeout(() => {setGame((game) => game + data)}, 1000)
        }
        setUserMove('');
      } catch(err) {
        console.warn(err);
      }
    }
  };

  const handleReset = () => {
    setUserMove('')
    setGame('')
    setStatus('')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.match(/^[a-z]$/i)) {
        setUserMove(event.key);
      } else if (event.key === 'Backspace') {
        setUserMove('');
      } else if (event.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    console.log(userMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMove]);

  
  return (
    <div className="text game">
      <form>
        <h2 className="title">Play a game of ghost?</h2>
        <br />
        <div className="rules">The rules are simple. We each have five lives, one for each letter of the word "GHOST." You play a letter, then I play a letter. If the letter you play completes a word with four or more letters, you loose a life. If the letter you play can't lead to any possible words, you loose a life. If you think I've played a word that can't possibly lead to a word, you can challenge me and if you're right, I'll lose a life. To make it fair, I'll tell you that we're using Meriam Webster's college dictionary as a word source. Here, I'll even let you go first.</div>
        <br />
        {status === '' ? (
          <div>
          <div className="game-input">{userMove.toUpperCase()}</div>
          <button className="urlButton" onClick={handleSubmit}>Submit</button>
        </div>
        ) : null }
        <h2 className="status">You {userLives}</h2>
        <h2 className="status">Computer {computerLives}</h2>
        <h2>Current Game: {game.toUpperCase()}</h2>
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
