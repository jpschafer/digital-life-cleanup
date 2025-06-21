 """
Tower Talk Automation Script

Tower Talk is a modern take on the ancient practice of stylite monks who would sit on towers—like Simeon Stylites—to observe life from a place of quiet contemplation, 
detached from immediate involvement but deeply connected in prayerful witness. This concept honors the need for spiritual distance and restful observation 
amidst the noise of daily life.

In today’s media landscape, this can include not only spiritually reflective content but also unexpected "Garbage TV" or low-stakes channels—shows that provide 
a kind of mental rest or gentle distraction, helping to calm and steady the mind through observation without demanding deep emotional involvement.

This script uses the YouTube Data API to:
- Retrieve the uploads playlist ID for each specified channel
- Fetch recent videos from those playlists
- Optionally filter videos by keywords
- Return a consolidated list of videos for further processing in Zapier (such as adding them to a dedicated YouTube playlist)

Sensitive data like API keys and playlist IDs are passed as input parameters, while channel IDs are hardcoded for security and simplicity.
"""

import requests

# === CONFIGURATION ===
API_KEY = input_data.get('API_KEY')  # passed as Zap input
PLAYLIST_ID = input_data.get('PLAYLIST_ID')  # passed as Zap input

# Hardcoded list of channel IDs - insert your channels here
CHANNEL_IDS = [
    'UC_x5XG1OV2P6uZZ5FSM9Ttw',  # Example: Google Developers channel ID
    # Add your actual channel IDs here as strings
]

# Optional: keyword filter to include videos (empty list = no filter)
KEYWORD_FILTERS = []  # e.g. ['spiritual', 'scripture']

# YouTube API endpoint for channel uploads playlist retrieval
YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

def get_uploads_playlist_id(channel_id):
    """Get the uploads playlist ID for a channel"""
    url = f'{YOUTUBE_API_BASE}/channels'
    params = {
        'part': 'contentDetails',
        'id': channel_id,
        'key': API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    items = data.get('items', [])
    if not items:
        return None
    return items[0]['contentDetails']['relatedPlaylists']['uploads']

def get_videos_from_playlist(playlist_id, max_results=5):
    """Get recent videos from a playlist"""
    url = f'{YOUTUBE_API_BASE}/playlistItems'
    params = {
        'part': 'snippet',
        'playlistId': playlist_id,
        'maxResults': max_results,
        'key': API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    videos = []
    for item in data.get('items', []):
        video_id = item['snippet']['resourceId']['videoId']
        title = item['snippet']['title']
        videos.append({'video_id': video_id, 'title': title})
    return videos

def filter_videos(videos, keywords):
    if not keywords:
        return videos
    filtered = []
    for video in videos:
        if any(k.lower() in video['title'].lower() for k in keywords):
            filtered.append(video)
    return filtered

# Main logic: gather videos per channel
all_videos = []

for channel_id in CHANNEL_IDS:
    uploads_playlist_id = get_uploads_playlist_id(channel_id)
    if not uploads_playlist_id:
        continue
    recent_videos = get_videos_from_playlist(uploads_playlist_id)
    filtered_videos = filter_videos(recent_videos, KEYWORD_FILTERS)
    all_videos.extend(filtered_videos)

# Here you’d add your own logic or external check to see if videos were already added.
# Since Zapier Code steps can’t store state, you pass this list to next Zap steps for processing.

# Return videos to Zap as output
output = {
    'videos': all_videos
}
