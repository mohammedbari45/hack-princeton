from flask_cors import CORS
from flask import Flask, jsonify
from cashback_scraper import CashbackScraper
import sqlite3
import logging
import json
from collections import defaultdict
import datetime


logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

app.logger.setLevel(logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Flask app started.")

def init_db():
    """Initialize the database with required tables"""
    try:
        conn = sqlite3.connect('cashback.db')
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_name TEXT NOT NULL,
            offers TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()
        conn.close()
        logger.info("Database initialized with the 'offers' table.")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")

init_db()


def save_offers(offers):
    """Save the scraped offers to the database"""
    logger.info("save_offers called with offers: %s", offers)
    try:
        conn = sqlite3.connect('cashback.db')
        cursor = conn.cursor()

        offers_to_insert = []
        for card in offers:
            for offer in card['offers']:
                offers_to_insert.append((card['card_name'], json.dumps(offer)))
        
        cursor.executemany(
            'INSERT INTO offers (card_name, offers) VALUES (?, ?)',
            offers_to_insert
        )
        
        conn.commit()  # Ensure changes are saved
        logger.info(f"{len(offers_to_insert)} offers saved to the database.")

    except sqlite3.Error as e:
        logger.error(f"Error inserting offers: {e}")

    finally:
        conn.close()  # Always close the connection

@app.route('/scrape', methods=['GET'])
def scrape():
    try:
        scraper = CashbackScraper()
        offers = scraper.scrape_all() 
        logger.info(f"Offers scraped: {offers}")
        save_offers(offers)  # Verify that offers are saved correctly
        return jsonify({'status': 'success', 'message': 'Scraping completed successfully'})
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/cashback', methods=['GET'])
def get_cashback():
    """
    Retrieve cashback offers formatted specifically for the React frontend.
    Returns data in the format expected by CashbackPage component:
    [
        {
            "card_name": "Card Name",
            "offers": ["offer1", "offer2", ...]
        }
    ]
    """
    try:
        # Connect to database with row factory
        conn = sqlite3.connect('cashback.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get all offers, ordered by most recent first
        cursor.execute('''
            SELECT DISTINCT card_name, offer_details 
            FROM offers 
            WHERE offer_details IS NOT NULL 
            AND offer_details != ''
            ORDER BY card_name, timestamp DESC
        ''')
        rows = cursor.fetchall()
        
        # Group offers by card using defaultdict
        card_offers = defaultdict(set)  # Using set to automatically handle duplicates
        
        # Process each row
        for row in rows:
            card_name = row['card_name']
            offer = row['offer_details'].strip()
            
            if offer:  # Only add non-empty offers
                card_offers[card_name].add(offer)
        
        # Format the response exactly as the frontend expects
        formatted_offers = [
            {
                'card_name': card_name,
                'offers': list(offers)  # Convert set to list
            }
            for card_name, offers in card_offers.items()
            if offers  # Only include cards that have offers
        ]
        
        # Sort cards alphabetically
        formatted_offers.sort(key=lambda x: x['card_name'])
        
        # Log the response structure
        logger.info(f"Returning {len(formatted_offers)} cards with offers")
        
        return jsonify(formatted_offers)
        
    except sqlite3.Error as e:
        logger.error(f"Database error in get_cashback: {e}")
        return jsonify([])  # Return empty array for frontend compatibility
        
    except Exception as e:
        logger.error(f"Unexpected error in get_cashback: {e}")
        return jsonify([])  # Return empty array for frontend compatibility
        
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/cashback/refresh', methods=['POST'])
def refresh_cashback():
    """
    Endpoint to trigger a refresh of the cashback data.
    Can be called from the frontend's refresh button.
    """
    try:
        # Here you could trigger your scraper if needed
        scraper = CashbackScraper()
        offers = scraper.scrape_all()
        
        if offers:
            conn = sqlite3.connect('cashback.db')
            cursor = conn.cursor()
            
            # Clear old offers
            cursor.execute('DELETE FROM offers')
            
            # Insert new offers
            for card in offers:
                for offer in card['offers']:
                    cursor.execute('''
                        INSERT INTO offers (card_name, offer_details, timestamp)
                        VALUES (?, ?, ?)
                    ''', (card['card_name'], offer, datetime.now()))
            
            conn.commit()
            conn.close()
            
            return jsonify({
                'status': 'success',
                'message': 'Offers refreshed successfully',
                'timestamp': datetime.now().isoformat()
            })
            
        return jsonify({
            'status': 'warning',
            'message': 'No new offers found'
        })
        
    except Exception as e:
        logger.error(f"Error refreshing offers: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to refresh offers'
        }), 500

# Optional: Add a status endpoint
@app.route('/cashback/status', methods=['GET'])
def get_status():
    """
    Get the status of the cashback system including last update time
    """
    try:
        conn = sqlite3.connect('cashback.db')
        cursor = conn.cursor()
        
        # Get the most recent timestamp
        cursor.execute('SELECT MAX(timestamp) FROM offers')
        last_update = cursor.fetchone()[0]
        
        # Get total number of offers
        cursor.execute('SELECT COUNT(DISTINCT card_name) as cards, COUNT(*) as offers FROM offers')
        counts = cursor.fetchone()
        
        return jsonify({
            'status': 'active',
            'last_update': last_update,
            'total_cards': counts[0],
            'total_offers': counts[1]
        })
        
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
