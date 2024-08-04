# scripts/scraper.py
import sys
import requests
from bs4 import BeautifulSoup
import json

def scrape_urls(url):
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True)]

        # Normalize links by removing any fragments or queries, and by making them absolute
        normalized_links = [requests.compat.urljoin(url, link) for link in links]

        return normalized_links
    except requests.RequestException as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        links = scrape_urls(url)
        print(json.dumps(links))
    else:
        print("Usage: python scraper.py <url>")
