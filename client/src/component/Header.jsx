import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return null; // Don't render the header on the home page
  }

  return (
    <header className="header" >
      <div onClick={() => navigate('/')} className="logo"></div>
      <h1 onClick={() => navigate('/')} className='clickable' >FractureCapture</h1>
    </header>
  );
};

export default Header;
