import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return null; // Don't render the header on the home page
  }

  return (
    <header className="header">
      <div className="logo"></div>
      <h1>FractureCapture</h1>
    </header>
  );
};

export default Header;
