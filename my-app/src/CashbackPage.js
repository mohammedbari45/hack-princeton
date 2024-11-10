<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

<<<<<<< HEAD
function CashbackPage() {
  return <h2>This is the Cashback Page</h2>;

}
=======
const CashbackPage = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://raw.githubusercontent.com/andenacitelli/credit-card-bonuses-api/main/exports/data.csv')
      .then((response) => {
        // Parse the CSV data using PapaParse
        Papa.parse(response.data, {
          header: true, // Convert rows to objects using headers as keys
          complete: (result) => {
            setBonuses(result.data); // Set parsed data to bonuses state
            setLoading(false);
          },
          error: () => {
            setError('Failed to parse CSV data.');
            setLoading(false);
          },
        });
      })
      .catch(() => {
        setError('Failed to load bonuses.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="cashback-page">
      <h2>Cashback Categories for the Month</h2>
      <div className="bonus-list">
        {bonuses.map((bonus, index) => (
          <div key={index} className="bonus-card">
            <h3>{bonus.cardName}</h3>
            <ul>
            {bonus.categories && bonus.categories.split(',').map((category, idx) => (
  <li key={idx}>{category}</li>
))}

            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
>>>>>>> aa23a22d064e64f778d0fc9151227a75920f12cc

export default CashbackPage;
=======
>>>>>>> 58a7ba829e25921ecddab7901f623b51da5a87f4
