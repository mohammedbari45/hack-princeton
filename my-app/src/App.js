import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import HomePage from './Homepage';
import CashbackPage from './CashbackPage';
import HousingPage from './HousingPage'
import Expenses from './Expenses'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/homepage" element={<HomePage/>} />
          <Route path="/expenses" element={<Expenses/>} />
          <Route path="/cashback" element={<CashbackPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
