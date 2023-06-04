import React, { useEffect, useState } from 'react';

const TimerComponent = (setStatus) => {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setStatus('out of time');
    }
  }, [timer]);

  return <h1>Timer: {timer}</h1>
};

export default TimerComponent;
