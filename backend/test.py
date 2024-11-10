from cashback_scraper import CashbackScraper

# Create an instance of the CashbackScraper class
scraper = CashbackScraper()

# Call scrape_all method
offers = scraper.scrape_all()

# Print the scraped offers to verify the output
print("Scraped Offers:", offers)
