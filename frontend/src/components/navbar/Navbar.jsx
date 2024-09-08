import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">WorldWanderer</h1>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/country-form">Country Form</Link>
          </li>
          <li className="navbar-item">
            <Link to="/fetch">Fetch all travels</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
