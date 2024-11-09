import React from 'react';
import './App.css'; // Make sure to import your CSS file

function Header() {
  return (
    <header className="App-header">
      <h1>Company Name</h1>
      <nav>
        <ul>
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
