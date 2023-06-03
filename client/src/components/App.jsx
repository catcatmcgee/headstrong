import React, { useState, useEffect } from 'react';
import Entry from './Entry.jsx';
import Memory from './Memory.jsx';
import AntiAsmr from './AntiAsmr.jsx'
import Quote from './Quote.jsx';
import Countdown from './Countdown.jsx';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import Ghost from './Ghost.jsx';
import axios from 'axios';
import GoogleButton from 'react-google-button';
import { Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [login, setLogin] = useState(false);
  const [entries, setEntries] = useState([]);

  const getAllMemories = () => {
    axios
      .get('/api/journals')
      .then(({ data }) => setEntries(data))
      .catch((err) => console.error('cannot get journals', err));
  };

  // get random quote for home page
  const getRandomQuote = () => {
    axios
      .get('/api/quotes')
      .then(({ data }) => {
        const randomIndex = Math.floor(Math.random() * data.length + 1);
        const { text, author } = data[randomIndex];
        setQuoteText(text);
        !author ? setQuoteAuthor('Anonymous') : setQuoteAuthor(author);
      })
      .catch((err) => console.error('error getting random quote', err));
  };

  const isLoggedIn = () => {
    axios
      .get('/isloggedin')
      .then(({ data }) => setLogin(data))
      .catch((err) => console.warn('error checking isLoggedIn', err));
  };

  useEffect(() => {
    isLoggedIn();
    getAllMemories();
    getRandomQuote();
  }, []);

  return (
    <div id='background-img'>
      <Routes>
        <Route
          path='/'
          element={<Quote
            entries={entries}
            quoteText={quoteText}
            quoteAuthor={quoteAuthor} />}
        />
        <Route
          path='/entry'
          element={<Entry />}
        />
        <Route
          path='/memory'
          element={<Memory
            entries={entries}
            getAllMemories={getAllMemories}/>}
        />
        <Route
          path='/countdown'
          element={<Countdown />}
        />
        <Route
          path='/relaxing-game'
          element={<Ghost />}
        />
        <Route
          path='/antiasmr'
          element={<AntiAsmr
            entries={entries}
            />}
        />
      </Routes>

      {!login ? (
        <div>
          <div className='loginMain'>
            <div className='text'>
              <h1>Welcome To HeadStrong!</h1>
              <h3>A stress-free, judgment free zone for you to get your thoughts out</h3>
            </div>
          </div>

          <a className='loginButton' href='/auth/google'>
            {' '}
            <GoogleButton />
          </a>
        </div>
      ) : (
          <Nav />
      )}
      <Footer />
    </div>
  );
};

export default App;
