import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar.jsx'
import Timer from './Timer.jsx'

const Ghost = () => {
  const [moveInput, setMoveInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('')
  const [game, setGame] = useState('');
  const [turnStatus, setTurnStatus] = useState('init');
  // const [turnStatus, setTurnStatus] = useState('user turn');
  const [userLives, setUserLives] = useState('GHOST');
  const [opponentLives, setOpponentLives] = useState('GHOST');
  const [definition, setDefinition] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [chatFocused, setChatFocused] = useState(false);

  /* * * * * * * * * * * HANDLING KEY STROKES * * * * * * * * * * * * */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if(chatFocused){
        return;
      }
      if (event.key.match(/^[a-z]$/i)) {
        if(turnStatus === 'opponent challenged'){
          setChallengeInput(challengeInput + event.key)
        } else {
          setMoveInput(event.key);
        }
      } else if (event.key === 'Backspace') {
        if(turnStatus === 'opponent challenged'){
          setChallengeInput(challengeInput.slice(0, -1))
        } else {
          setMoveInput('');
        }
      } else if (event.key === 'Enter') {
        if(turnStatus==='user turn'){
          handleSubmit(event);
        } else if (turnStatus === 'opponent challenged'){
          handleChallengeSubmit();
        } else {
          startRound(event);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveInput, turnStatus, challengeInput, chatFocused]);

  useEffect(()=>{
    console.log(turnStatus);
  }, [turnStatus]);

  /* * * * * * * * * * * SERVER REQUESTS * * * * * * * * * * * * */
  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    if (disableSubmit) return;
    setDisableSubmit(true);

    try {
      const { data } = await axios.post('/api/ghost', {game: (game + moveInput).toLowerCase()});
      if (data.end === 'odd') {
        setGame(game + moveInput);
          setTurnStatus('complete');
          setUserLives(userLives.slice(0,-1))
      } else if (data.end === 'even') {
        setGame(game + moveInput + data.letter);
        setTimeout(() => {
          setTurnStatus('cheated');
          setOpponentLives(opponentLives.slice(0,-1))
        }, 1000)
      } else if (data === '') {
        setGame(game + moveInput);
        setTimeout(() => {
          setTurnStatus('opponent challenged');
          setUserLives(userLives.slice(0,-1))
        }, 1000)
      } else {
      setGame(game + moveInput);
      setTimeout(() => {setGame((game) => game + data)}, 1000)
      }
      setMoveInput('');
      setTimeout(() => {
        setDisableSubmit(false);
      }, 1000);
    } catch(err) {
      console.warn(err);
      setTimeout(() => {
        setDisableSubmit(false);
      }, 1000);
    }
  };

  const handleUserChallenge = async (e) => {
    if(e) e.preventDefault();
    setTurnStatus('user challenged');
    try {
      const {data} = await axios.get(`/api/ghost`, { params: { game } });
      console.log('word lookup', data)
      if(data.invalid){
        setTimeout(() => {setTurnStatus('user challenge success')}, randomTime(8000));
      } else if(Object.keys(data).length) {
        setTimeout(() => {
          const word = Object.keys(data)[0]
          setTurnStatus('user challenge failed')
          setGame(word)
          setUserLives(userLives.slice(0, -1));
          setDefinition(data[word])
        }, randomTime(8000));
      }
    } catch(err) {
      console.warn(err);
    }
  };

  const handleChallengeSubmit = async (e) => {
    setChallengeInput('');
    setGame(game+challengeInput);
    setTurnStatus('invalid');
  };

  /* * * * * * * * * * * HELPER FUNCTIONS * * * * * * * * * * * * */
  function randomTime(max) {
    return Math.floor(Math.random()*(max));
  }

  function startRound(e) {
    e.preventDefault();
    setMoveInput('')
    setGame('')
    setTurnStatus('user turn')
  }

  function findMatch() {
    setTurnStatus('pairing');
    const miliseconds = randomTime(7000)
    setTimeout(()=> {setTurnStatus('paired')}, miliseconds);
    setTimeout(()=> {setTurnStatus('user turn')}, miliseconds + 10);
  }

  /* * * * * * * ALTERNATIVE CONDITIONAL RENDERINGS * * * * * * * */

  if(turnStatus==='init'){
    return (
      <div className="gamepage">
        <div className="text wrap">
          <h1 className="title">Play a game of ghost?</h1>
          <br />
          <p>The rules are simple.</p>
          <br />
          <p>
            You have five lives, one for each letter of the word "GHOST".
            The objective of the game is to be the last player to have lives
            remaining.

            Each player takes turns adding a letter to an ever-growing word
            fragment. Try not to spell a word (of length 4 letters or more).
            Try to force another player to spell a word, or else try to get a
            player to say a letter that makes it impossible to form a word.

            To start, say any letter of
            the alphabet. Each player then takes turns adding a single letter to
            the word fragment. Instead of adding a letter, a player can “challenge” the
            last player who added a letter, if they thinks a word does not exist
            that starts with the current fragment. If a challenge occurs, the last player
            must try to say a word that begins with the fragment. If the player
            who was challenged is able to spell a word, the challenger loses a life.
            If the player who was challenged cannot spell a word, the challenger
            earns a life. If a player accidentally spells a word, they
            also loses a life. The round ends and a new round is begun up until a player
            loses all of their lives, at which point they die and the other player wins.
          </p>
          <button className="urlButton" onClick={findMatch}>Find A Match</button>
        </div>
      </div>
    )
  }

  if(turnStatus==='pairing'){
    return (
      <div className="gamepage">
        <div className="text wrap">
          <h1 className="title">Finding opponent...</h1>
        </div>
      </div>
    )
  }

  const ScoreTracker = ({userLives, opponentLives}) => {
    return (
      <div className="score-tracker">
        <div className="score-item">
          <h2 className="text">You</h2>
          <h2 className="game-logo">{userLives}</h2>
        </div>
        <div className="score-divider"></div>
        <div className="score-item">
          <h2 className="text">Opponent</h2>
          <h2 className="game-logo">{opponentLives}</h2>
        </div>
      </div>
    )
  }
    
  /* * * * * * * MAIN RENDERING * * * * * * * */
  return (
    <div className="gamepage">  
      <form className="text game">
        <ScoreTracker userLives={userLives} opponentLives={opponentLives} />
        <br />
        {userLives.length === 0
        ? (<h1>YOU LOSE!</h1>)
        : (
          <div className="round">
          <h2>ROUND #</h2>
          <br></br>
          <div className="round-word-fragment">
            {game.split('').map((char, i) => <span key={i} className="game-input">{char.toUpperCase()}</span>)}
            {turnStatus === 'user turn' ? (
            <div className="game-input user-input">{moveInput.toUpperCase()}</div>
            ) : turnStatus === 'opponent challenged' ? (
              <div>
                {challengeInput.split('').map((char, i) => <span key={i} className="game-input user-input">{char.toUpperCase()}</span>)}
              </div>
            ) : null}
          </div>
          <br />
          {turnStatus === 'user turn' || turnStatus === 'paired' ? (
            <div>
              <button className="urlButton game-button" onClick={handleSubmit}>Submit</button>
              <button className="urlButton challenge-button" onClick={handleUserChallenge}>Challenge</button>
            </div>
          ) : turnStatus === 'user challenged' ? (
            <div>
              <Timer turnStatus={turnStatus} setTurnStatus={setTurnStatus}/>
              <h1>YOU HAVE CHALLENGED YOUR OPPONENT</h1>
              <h3>THEY HAVE 10 SECONDS TO SUMBIT A CORRECT WORD</h3>
            </div>
          ) : turnStatus === 'user challenge failed' ? (
            <div>
              <h1>YOUR OPPONENT SUBMITTED A VALID WORD</h1>
              <h3>WORD DEFINITION:</h3>
              <h3>"{definition}"</h3>
              <button className="urlButton" onClick={startRound}>Start Round</button>
            </div>
          ) : turnStatus === 'opponent challenged' ? (
            <div>
              <Timer turnStatus={turnStatus} setTurnStatus={setTurnStatus}/>
              <h1>YOUR OPPONENT HAS CHALLENGED YOU</h1>
              <h3>YOU HAVE 10 SECONDS TO ENTER A VALID WORD</h3>
              <button className="urlButton" onClick={()=>handleChallengeSubmit}>Submit</button>
            </div>
          ) : (
            <div>
              <h1>YOU LOST A LIFE</h1>
              <h3>reason: {turnStatus}</h3>
              <button className="urlButton" onClick={startRound}>Start Round</button>
            </div>
          )}
        </div>)}   
      </form>
      <ChatSidebar className="sidebar" userLives={userLives} turnStatus={turnStatus} setChatFocused={setChatFocused}/>
    </div>
  );
};

export default Ghost;
