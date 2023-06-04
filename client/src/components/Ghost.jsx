import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar.jsx'
import Timer from './Timer.jsx'

const Ghost = () => {
  const [userMove, setUserMove] = useState('');
  const [game, setGame] = useState('');
  //const [status, setStatus] = useState('init');
  const [status, setStatus] = useState('user turn');
  const [userLives, setUserLives] = useState('GHOST');
  const [opponentLives, setOpponentLives] = useState('GHOST');
  const [definition, setDefinition] = useState('');

  /* * * * * * * * * * * USE EFFECTS * * * * * * * * * * * * */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.match(/^[a-z]$/i)) {
        setUserMove(event.key);
      } else if (event.key === 'Backspace') {
        setUserMove('');
      } else if (event.key === 'Enter') {
        if(status==='user turn'){
          handleSubmit();
        } else {
          startRound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    console.log(userMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMove]);

  useEffect(() => {
    const throttleSubmit = throttle(handleSubmit, 1000);
    return () => {
      throttleSubmit.cancel();
    };
  }, []);

  /* * * * * * * * * * * SERVER REQUESTS * * * * * * * * * * * * */
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    try {
      const { data } = await axios.post('/api/ghost', {game: (game + userMove).toLowerCase()});
      if (data.end === 'odd') {
        setGame(game + userMove);
        setTimeout(() => {
          setStatus('complete');
          setUserLives(userLives.slice(0,-1))
        }, 1000)
      } else if (data.end === 'even') {
        setGame(game + userMove + data.letter);
        setTimeout(() => {
          setStatus('cheated');
          setOpponentLives(opponentLives.slice(0,-1))
        }, 1000)
      } else if (data === '') {
        setGame(game + userMove);
        setTimeout(() => {
          setStatus('invalid');
          setUserLives(userLives.slice(0,-1))
        }, 1000)
      } else {
      setGame(game + userMove);
      setTimeout(() => {setGame((game) => game + data)}, 1000)
      }
      setUserMove('');
    } catch(err) {
      console.warn(err);
    }
  };

  const handleChallenge = async (e) => {
    if(e) e.preventDefault();
    setStatus('user challenged');
    try {
      const {data} = await axios.get(`/api/ghost`, { params: { game } });
      console.log(data);
      if(data.invalid){
        setTimeout(() => {setStatus('user challenge success')}, randomTime(10000));
      } else if(Object.keys(data).length) {
        setTimeout(() => {
          const word = Object.keys(data)[0]
          setStatus('user challenge failed')
          setGame(word)
          console.log(word, data, data[word])
          setDefinition(data.word)
        }, randomTime(10000));
      }
    } catch(err) {
      console.warn(err);
    }
  };

  /* * * * * * * * * * * HELPER FUNCTIONS * * * * * * * * * * * * */
  const randomTime = (max) => {
    return Math.floor(Math.random()*(max));
  }

  const startRound = (e) => {
    e.preventDefault();
    setUserMove('')
    setGame('')
    setStatus('user turn')
  }

  const findMatch = () => {
    setStatus('pairing');
    setTimeout(()=> {setStatus('user turn')}, randomTime(5000));
  }

  /* * * * * * * ALTERNATIVE CONDITIONAL RENDERINGS * * * * * * * */

  // if(status==='init'){
  //   return (
  //     <div className="gamepage">
  //       <div className="text wrap">
  //         <h1 className="title">Play a game of ghost?</h1>
  //         <br />
  //         <p>The rules are simple.</p>
  //         <br />
  //         <p>
  //           You have five lives, one for each letter of the word "GHOST".
  //           The objective of the game is to be the last player to have lives
  //           remaining.

  //           Each player takes turns adding a letter to an ever-growing word
  //           fragment. Try not to spell a word (of length 4 letters or more).
  //           Try to force another player to spell a word, or else try to get a
  //           player to say a letter that makes it impossible to form a word.

  //           To start, say any letter of
  //           the alphabet. Each player then takes turns adding a single letter to
  //           the word fragment. Instead of adding a letter, a player can “challenge” the
  //           last player who added a letter, if they thinks a word does not exist
  //           that starts with the current fragment. If a challenge occurs, the last player
  //           must try to say a word that begins with the fragment. If the player
  //           who was challenged is able to spell a word, the challenger loses a life.
  //           If the player who was challenged cannot spell a word, the challenger
  //           earns a life. If a player accidentally spells a word, they
  //           also loses a life. The round ends and a new round is begun up until a player
  //           loses all of their lives, at which point they die and the other player wins.
  //         </p>
  //         <button className="urlButton" onClick={findMatch}>Find A Match</button>
  //       </div>
  //     </div>
  //   )
  // }

  // if(status==='pairing'){
  //   return (
  //     <div className="gamepage">
  //       <div className="text wrap">
  //         <h1 className="title">Finding opponent...</h1>
  //       </div>
  //     </div>
  //   )
  // }

  const ScoreTracker = ({userLives, opponentLives}) => {
    return (
      <div className="score-tracker">
        <div className="score-item">
          <h2 className="text">You</h2>
          <h2 className="logo">{userLives}</h2>
        </div>
        <div className="score-divider"></div>
        <div className="score-item">
          <h2 className="text">Opponent</h2>
          <h2 className="logo">{opponentLives}</h2>
        </div>
      </div>
    )
  }
    
  /* * * * * * * MAIN RENDERING * * * * * * * */
  return (
    <div className="gamepage">  
      <form className="text game">
        <br />
        <br />
        <ScoreTracker userLives={userLives} opponentLives={opponentLives} />
        <h2>Current Game</h2>
        <h2 className='logo'>{game.toUpperCase()}</h2>
        {status === 'user turn' ? (
          <div>
            <div className="game-input">{userMove.toUpperCase()}</div>
            <button className="urlButton game-button" onClick={handleSubmit}>Submit</button>
            <button className="urlButton challenge-button" onClick={handleChallenge}>Challenge</button>
          </div>
        ) : status === 'user challenged' ? (
          <div>
            <h1>YOU HAVE CHALLENGED YOUR OPPONENT</h1>
            <h3>THEY HAVE 10 SECONDS TO SUMBIT A CORRECT WORD</h3>
            <Timer setStatus={setStatus}/>
          </div>
        ) : status === 'user challenge failed' ? (
          <div>
            <h1>YOUR OPPONENT SUBMITTED A VALID WORD</h1>
            <h3>WORD DEFINITION:</h3>
            <h3>{definition}</h3>
            <button className="urlButton" onClick={startRound}>Start Round</button>
          </div>
        ) : status === 'complete' ? (
          <div>
            <h1>YOU IDIOT, YOU FINISHED A WORD</h1>
            <button className="urlButton" onClick={startRound}>Start Round</button>
          </div>
        ) : status === 'cheated' ? (
          <div>
            <h1>YOU'RE A CHEARER</h1>
            <button className="urlButton" onClick={startRound}>Start Round</button>
          </div>
        ) : status === 'invalid' ? (
          <div>
            <h1>THATS NOT A WORD, STUPID</h1>
            <button className="urlButton" onClick={startRound}>Start Round</button>
          </div>
        ) : (
          null
        )}

      </form>
      <ChatSidebar className="sidebar"/>
    </div>
  );
};

export default Ghost;
