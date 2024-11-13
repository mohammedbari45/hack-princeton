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
    
            // Optionally: First trigger a refresh
            await axios.post('http://localhost:5000/cashback/refresh');
            
            // Then get the updated data
            const response = await axios.get('http://localhost:5000/cashback');
            
            if (response.data && Array.isArray(response.data)) {
                setOffers(response.data);
                setLastUpdate(new Date().toLocaleString());
            } else {
                setError('Invalid data format received.');
            }
        } catch (err) {
            setError('Failed to fetch cashback offers. Please try again later.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []); // Empty dependency array ensures this runs only once after the initial render

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

            {!loading && !error && offers.length > 0 && (
                <div className="offers-grid">
                    {offers.map((offer, index) => (
                        <div key={index} className="offer-card">
                            <h2>{offer.card_name}</h2>
                            <ul>
                                {offer.offers.map((offerDetail, i) => (
                                    <li key={i}>{offerDetail}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && offers.length === 0 && (
                <div className="no-offers">
                    No cashback offers available at the moment.
                </div>
            )}
        </div>
    );
};

const checkStatus = async () => {
    try {
        const response = await axios.get('http://localhost:5000/cashback/status');
        setLastUpdate(new Date(response.data.last_update).toLocaleString());
    } catch (err) {
        console.error('Status check failed:', err);
    }
};

export default CashbackPage;
