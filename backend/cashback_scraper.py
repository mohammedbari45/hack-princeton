import requests
from bs4 import BeautifulSoup

class CashbackScraper:
    def scrape_discover(self):
        url = 'https://www.discover.com/credit-cards/rewards-credit-cards/'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        offers = []
        for offer in soup.select('.cmp-container__column .text p'):
            text = offer.get_text(strip=True)
            if text: 
                offers.append(text)
        
        return {'card_name': 'Discover', 'offers': offers}


    def scrape_chase(self):
        url = 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Select the content for each section
        offers = []

        # Cardmember offer
        card_member_offer = soup.select_one('.cmp-cardsummary__inner-container--card-member-offer p')
        if card_member_offer:
            offers.append(card_member_offer.get_text(strip=True))
        
        # At a glance (rewards)
        rewards = soup.select_one('.cmp-cardsummary__inner-container--glance p')
        if rewards:
            offers.append(rewards.get_text(strip=True))
        
        # APR
        apr = soup.select_one('.cmp-cardsummary__inner-container--purchase-apr p')
        if apr:
            offers.append(apr.get_text(strip=True))

        # Annual fee
        annual_fee = soup.select_one('.cmp-cardsummary__inner-container--annual-fee p')
        if annual_fee:
            offers.append(annual_fee.get_text(strip=True))

        return {'card_name': 'Chase', 'offers': offers}

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
        
        # Log the collected offers for debugging
        print(f"Scraped offers: {offers}")
        
        # Return the collected offers
        return offers
