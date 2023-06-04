import React, { useEffect, useState } from 'react';

const TimerComponent = ({turnStatus, setTurnStatus}) => {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      if (turnStatus === 'user challenged') {
        setTurnStatus('opponent out of time');
      } else if (turnStatus === 'opponent challenged') {
        setTurnStatus('user out of time')
      }
    }
  }, [timer]);

  return <h1>Timer: {timer}</h1>
};

export default TimerComponent;
