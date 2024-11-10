import requests
from bs4 import BeautifulSoup

class CashbackScraper:
    def scrape_discover(self):
        url = 'https://www.discover.com/credit-cards/rewards-credit-cards/'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        return {'card_name': 'Discover', 'offers': [offer.get_text(strip=True) for offer in soup.select('cmp-container__column cmp-container__column-3 cmp-container-2')]}

    def scrape_chase(self):
        url = 'https://creditcards.chase.com/rewards-credit-cards'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        return {'card_name': 'Chase', 'offers': [offer.get_text(strip=True) for offer in soup.select('cmp-cardsummary__inner-container--summary')]}

    def scrape_amex(self):
        url = 'https://www.americanexpress.com/us/credit-cards/'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        return {'card_name': 'American Express', 'offers': [offer.get_text(strip=True) for offer in soup.select('.axp-shop-us-consumer__index__cardTileDefaultBenefits___2DaIq')]}
    def scrape_all(self):
        # Initialize an empty list to collect all offers
        offers = []
        
        # Scrape each card and append to the offers list
        discover_offers = self.scrape_discover()
        if discover_offers['offers']:  # Check if there are any offers
            offers.append(discover_offers)

        chase_offers = self.scrape_chase()
        if chase_offers['offers']:
            offers.append(chase_offers)

        amex_offers = self.scrape_amex()
        if amex_offers['offers']:
            offers.append(amex_offers)
        
        # Log the collected offers for debugging
        print(f"Scraped offers: {offers}")
        
        # Return the collected offers
        return offers
