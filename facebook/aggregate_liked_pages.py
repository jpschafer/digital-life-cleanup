import requests
import json
from collections import defaultdict

# Replace with your access token
ACCESS_TOKEN = "EACApFx8kikQBO44LkEqK76aShgvuzpXUm9dAFaaIf4kfTNb2WyfNbZCZAjkETvnpMGYkQlUaxAvSdT4baHCXTi2KSiZA82wCHMTRaUXGx8PyigZCm95AtqVLroZBFlCPESmmu9cpEBEFtFOc712oWZBz3qE09MSNqjRZAEBszZAZCNJo9avTzP2blpf2rYsqNTSWtUqStPnOyUfPEDK2VOmBKEqQfd1r8K68chuvnJcaSpTaLQKP6aURRkVlweJUwlMlxoZBK1ml05L04ZD"

# Facebook API Endpoint to get liked pages
URL = f"https://graph.facebook.com/v18.0/me/likes?fields=name,category,link&access_token={ACCESS_TOKEN}"

def get_liked_pages():
    pages_by_category = defaultdict(list)
    
    next_url = URL
    while next_url:
        response = requests.get(next_url)
        data = response.json()

        if "data" in data:
            for page in data["data"]:
                category = page.get("category", "Unknown")
                name = page.get("name", "Unnamed Page")
                link = page.get("link", "No Link Available")
                pages_by_category[category].append((name, link))
        
        # Get next page (pagination)
        next_url = data.get("paging", {}).get("next", None)

    return pages_by_category

def main():
    pages = get_liked_pages()
    for category, pages_list in pages.items():
        print(f"\n{category}:")
        for name, link in pages_list:
            print(f"  - {name} ({link})")

if __name__ == "__main__":
    main()