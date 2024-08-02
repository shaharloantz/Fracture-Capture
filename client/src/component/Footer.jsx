import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 FractureCapture. All rights reserved.</p>
                <p>
                    <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
                </p>
                <p> ט.ל.ח</p>
            </div>
        </footer>
    );
}

export default Footer;
