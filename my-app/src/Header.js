import React from 'react';
import './App.css'; // Make sure to import your CSS file
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      <img src = "real_logo.png" alt = "Company Logo, titled Peyer, written by using different world currencies"></img>
      <h1>Company Name</h1>
      <nav>
        <ul>
        <li><Link to="/homepage">Home</Link></li>
        <li><Link to="/expenses">Expenses</Link></li>
          <li><Link to="/cashback">Cashback</Link></li>
          <li><Link to="/housing">Housing</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
        </ul>
      </nav>
      <div className="profile-icon">
        <img src="profile-icon.png" alt="Profile" />
      </div>
    </header>
  );
}

export default Header;
