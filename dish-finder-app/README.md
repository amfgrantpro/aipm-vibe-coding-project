# Cuisine Finder App

A lightweight web application that helps users find restaurants serving their favorite cuisine. Enter a cuisine type and location, and get back a ranked list of nearby restaurants.

## Quick Start

### Prerequisites
- Node.js (v16+) and npm

### Setup & Run

**Option 1: Automated Setup (Recommended)**

1. Run the setup script:

macOS/Linux:
```bash
./setup.sh
```
(If you get a permission error, run `chmod +x setup.sh` first)

Windows:
```bash
setup.bat
```

2. Start the backend server (Terminal 1):
```bash
cd backend && npm run dev
```
You should see: `🍽️  Cuisine Finder backend running on http://localhost:5001`

3. Start the frontend server (Terminal 2):
```bash
cd frontend && npm run dev
```
You should see: `VITE v5.x.x  ready in xxx ms`

4. Open your browser:
```
http://localhost:3000
```

5. Try a search (works specifically well in Berlin):
   - Cuisine: `Korean`
   - Location: `Berlin, Germany`
   - Click **Search**
   
   Or try:
   - Cuisine: `Italian`
   - Location: `Rome, Italy`

## Usage

1. Enter a **cuisine name** (e.g., "Korean", "Vietnamese", "Italian")
2. Enter a **location** (e.g., "Berlin, Germany")
3. Click **Search**
4. View results sorted by distance:
   - 🟢 **Cuisine match** - Restaurant confirmed to serve this cuisine (via OpenStreetMap data)

## Features

### Core
- Form to search by cuisine and location
- Backend API that queries OpenStreetMap for specific cuisine types
- Results ranked by distance
- Simple, clean UI

### Real Data via OpenStreetMap
The app uses **free, open-source APIs** to find real restaurants:
- **Nominatim**: Geocodes your address/city to coordinates
- **Overpass API**: Queries OpenStreetMap for restaurants with specific `cuisine` tags
- **Real-time results** for any address worldwide
- No API keys required

## Project Structure

```
dish-finder-app/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main app with /search endpoint
│   └── package.json
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   └── components/     # SearchForm, ResultsList, ResultCard
│   ├── index.html
│   └── package.json
├── setup.sh / setup.bat    # Automated setup scripts
└── README.md
```

## API Endpoint

### POST /search
Search for restaurants by cuisine and location.

**Request:**
```json
{
  "cuisine": "korean",
  "location": "Berlin"
}
```

**Response:**
```json
{
  "success": true,
  "query": {
    "cuisine": "korean",
    "location": "Berlin"
  },
  "resultCount": 4,
  "results": [
    {
      "id": "1",
      "name": "Kimchi Princess",
      "address": "Skalitzer Str. 36, Berlin",
      "distance": "0.3 miles",
      "phone": "+49 30 123456",
      "cuisine": "korean",
      "timestamp": "2025-12-10T..."
    }
  ]
}
```

## Development Notes

### Tech Stack
- **Backend**: Node.js, Express, Axios, CORS
- **Frontend**: React 18, Vite, Axios
- **Styling**: Vanilla CSS with modular structure
- **Location APIs**: Nominatim (Geocoding) + Overpass (Restaurant data)

### Overpass Implementation
The app maps user input (e.g., "Italian") to optimal Overpass regex queries (e.g., `cuisine~"italian|pizza|pasta"`).

## License

This is a demonstration project for educational purposes.
