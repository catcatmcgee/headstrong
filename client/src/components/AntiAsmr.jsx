import React, { useEffect, useState } from 'react';

const SoundCloudWidget = () => {


const boarnana = '1526241481'

//not usefull but good for me to know which is which
const clipsObject = {
  bird: '1526375440',

  balloonClip: '1526385292',

  boostedRamenClip: '1526385283',

  dryEraseBoard: '1526385259',

  forkPot: '1526385250',

  macNCheeseClip: '1526385226',

  nailsOnChalkboard: '1526385211',

  sleepMusicClip: '1526385187',

  styrofoamClip: '1526385172',

  vacuumCleanerClip: '1526385151',
  
  ptRadio: '1526473978'
}

const clipsArray = Object.values(clipsObject)


const [randomClip, setRandomClip] = useState(() => {
  const randomIndex = Math.floor(Math.random() * clipsArray.length);
  return clipsArray[randomIndex];
});

const handleRefresh = () => {
  const randomIndex = Math.floor(Math.random() * clipsArray.length);
  setRandomClip(clipsArray[randomIndex]);
};


  return (
    <div>
      <h2>Welcome back</h2>
      <div>
        <i>Enjoy some vexatious Anti-ASMR 🤗</i>
      </div>
      <iframe
        id="soundcloud-widget"
        width="150%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${randomClip}&amp;auto_play=true&amp;color=%230066CC&amp;buying=true&amp;sharing=true&amp;download=true&amp;show_artwork=true&amp;show_playcount=true&amp;show_user=true`}
      ></iframe>
      <button onClick={handleRefresh}>Refresh</button>
      <button>Save</button>
    </div>
  );
};

export default SoundCloudWidget;
