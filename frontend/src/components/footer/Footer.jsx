import React from 'react';
import './styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3 className="footer-logo">WorldWanderer</h3>
        <ul className="footer-socials">
          <li><a href="https://twitter.com/developer" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li><a href="https://github.com/Mathamen/blockchain-rust" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://linkedin.com/in/developer" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
