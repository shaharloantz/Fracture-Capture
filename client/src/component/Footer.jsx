import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 FractureCapture. All rights reserved.</p>
        <p>
          <Link to="/terms-of-service">Terms of Service</Link> | <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
        <p> ט.ל.ח</p>
      </div>
    </footer>
  );
}

export default Footer;
