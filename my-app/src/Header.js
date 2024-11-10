import React from 'react';
import './App.css'; // Make sure to import your CSS file
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      <h1>
      <img className = "real_logo" src = "real_logo.png" alt = "logo"/>
      </h1>
      <nav>
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/expenses">Expenses</Link></li>
          <li><Link to="/cashback">Cashback</Link></li>
          <li><Link to="/housing">Housing</Link></li>
          <li><Link to="/classifier">Classifier</Link></li>
        </ul>
      </nav>
      <div className="profile-icon">
      <Link to="/profile"> 
    <img className="profile-icon" src="profile-icon.png" alt="profile button" />
  </Link>
      </div>
    </header>
  );
}

export default Header;
