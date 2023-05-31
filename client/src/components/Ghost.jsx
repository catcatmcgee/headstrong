import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

const Ghost = () => {

  const [userMove, setUserMove] = useState('');
  const [game, setGame] = useState('');

  const handleChange = (e, setType) => {
    setType(e.target.value);
  };

  const handleSubmit = () => {
    axios.post('/api/ghost', userMove)
      .then((data) => console.info('played letter submitted:\n', data))
      .catch((err) => console.warn(err));
  };

  return (
    <div className="text wrap">
      <form>
        <h2 className="title">Play a game of ghost?</h2>
        <br />
        <div className="rules">The rules are simple, you play one letter, then I play a letter. If the letter you play complete's a word, you loose. If the letter you play can't lead to any possible word, you loose. To make it fair, I'll tell you that we're using Meriam Webster's college dictionary. Here' I'll even let you go first.</div>
        <br />
        <div>
          <textarea className="form-control"
            placeholder="Give your post a userMove"
            value={userMove}
            onChange={(e) => handleChange(e, setUserMove)}/>
        </div>
        <button className="urlButton" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default Ghost;
