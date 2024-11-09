import React from 'react';
import './App.css'; // Make sure to import your CSS file

function Header() {
  return (
    <header className="App-header">
      <img src = "real_logo.png" alt = "Company Logo, titled Peyer, written by using different world currencies"></img>
      <h1>Company Name</h1>
      <nav>
        <ul>
          <li><a href="#homepage">Homepage</a></li>
          <li><a href="#expenses">Expenses</a></li>
          <li><a href="#cashback">Cashback</a></li>
          <li><a href="#housing">Housing</a></li>
          <li><a href="#restaurants">Restaurants</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
