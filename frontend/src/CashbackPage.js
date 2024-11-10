import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CashbackPage.css';

const CashbackPage = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Updated URLs to use port 5001
            await axios.get('http://localhost:5001/scrape');
            const response = await axios.get('http://localhost:5001/cashback');
            
            setOffers(response.data);
            setLastUpdate(new Date().toLocaleString());
        } catch (err) {
            setError('Failed to fetch cashback offers. Please try again later.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <div className="cashback-container">
            <div className="header">
                <h1>Credit Card Cashback Offers</h1>
                <button 
                    onClick={fetchOffers} 
                    disabled={loading}
                    className="refresh-button"
                >
                    {loading ? 'Refreshing...' : 'Refresh Offers'}
                </button>
                {lastUpdate && (
                    <div className="last-update">
                        Last updated: {lastUpdate}
                    </div>
                )}
            </div>

            {loading && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Fetching latest offers...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="offers-grid">
                    {offers.map((offer, index) => (
                        <div key={index} className="offer-card">
                            <h2>{offer.card_name}</h2>
                            <p>{offer.offer_details}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CashbackPage;