from flask import Flask, jsonify
from flask_cors import CORS
from cashback_scraper import CashbackScraper
import sqlite3
import logging

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect('cashback.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_name TEXT NOT NULL,
        offer_details TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

def save_offers(offers):
    """Save the scraped offers to the database"""
    conn = sqlite3.connect('cashback.db')
    cursor = conn.cursor()

    # Insert new offers
    for card in offers:
        for offer in card['offers']:
            cursor.execute(
                'INSERT INTO offers (card_name, offer_details) VALUES (?, ?)',
                (card['card_name'], offer)
            )
            print(f"Inserted offer: {card['card_name']} - {offer}")

    conn.commit()
    conn.close()


@app.route('/scrape', methods=['GET'])
def scrape():
    try:
        scraper = CashbackScraper()
        offers = scraper.scrape_all()  # Ensure this method works
        save_offers(offers)  # Verify that offers are saved correctly
        return jsonify({'status': 'success', 'message': 'Scraping completed successfully'})
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/cashback', methods=['GET'])
def get_cashback():
    """Endpoint to get stored offers"""
    try:
        conn = sqlite3.connect('cashback.db')
        cursor = conn.cursor()
        cursor.execute('SELECT card_name, offer_details FROM offers')
        offers = cursor.fetchall()
        conn.close()

        # Format the data
        formatted_offers = [
            {
                'card_name': card_name,
                'offer_details': offer_details
            }
            for card_name, offer_details in offers
        ]

        return jsonify(formatted_offers)
    except Exception as e:
        logger.error(f"Error fetching offers: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5001)
