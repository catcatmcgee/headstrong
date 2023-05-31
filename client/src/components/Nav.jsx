import React from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <AppBar>
      <div className='logo'>HeadStrong</div>
      <div>
        <div className='nav'>
          <Button className='Button'>
            <Link to='/'>Home</Link>
          </Button>

          <Button className='Button'>
            <Link to='/entry'>Entry</Link>
          </Button>

          <Button className='Button'>
            <Link to='/memory'>Memory</Link>
          </Button>

          <Button className='Button'>
            <Link to='/relaxing-game'>Mindfulness Game</Link>
          </Button>

          <Button
            className='Button'
            onClick={() =>
              axios
                .delete('/logout')
                .then(({ data }) => logout(data))
                .catch((err) => console.warn(err))
            }
          >
            Logout
          </Button>
        </div>
      </div>
    </AppBar>
  );
};

export default Nav;
