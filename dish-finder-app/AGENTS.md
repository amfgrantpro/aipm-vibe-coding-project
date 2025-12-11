# Agent Instructions for Dish Finder App

## Project Overview
This is a web application that helps users find restaurants serving their favorite dishes. Users enter a dish name and location, the backend queries restaurant data and performs dish validation through multiple methods (menu APIs, reviews, etc.), and the frontend displays results with confidence levels.

## Architecture Overview
- **Backend**: Node.js/Express server (localhost:5001)
  - Receives search requests with dish name and location
  - Validates dishes against restaurant menus and reviews
  - Returns structured results with confidence levels
  - File: `backend/server.js`

- **Frontend**: React with Vite (localhost:3000)
  - Search form for dish and location input
  - Results display with restaurant cards
  - Confidence badges (Found on menu, Mentioned in reviews, Not confirmed)
  - Files: `frontend/src/App.jsx`, components in `frontend/src/components/`

## Core Features

### 1. Search Endpoint
- **Route**: `POST /search`
- **Request body**: `{ dish, location }`
- **Response**: JSON with results array containing:
  - `name`: Restaurant name
  - `address`: Address
  - `distance`: Distance from user
  - `dishConfidence`: Confidence level (string)
  - `source`: Where confidence came from (menu/reviews/none)

### 2. Dish Validation Logic
Current implementation in `backend/server.js` uses:
- **Menu matching**: Checks if dish appears in restaurant's menu items
- **Review matching**: Scans reviews for dish keywords
- **Confidence levels**:
  - `"Found on menu"` → Highest confidence (source: 'menu')
  - `"Mentioned in reviews"` → Medium confidence (source: 'reviews')
  - `"Not confirmed"` → No confirmation (source: 'none')

### 3. UI Components
- **SearchForm**: Input fields for dish and location, quick-example buttons
- **ResultsList**: Container for result cards
- **ResultCard**: Individual restaurant display with badges and info

## Enhancement Points for AI Agents

### Phase 0: OpenStreetMap + Overpass Integration (Current)
Replace mock data with real restaurants using free APIs. No authentication needed.

**Prompt for AI Agent:**
```
Task: Integrate OpenStreetMap Nominatim geocoding and Overpass API to replace mock restaurant data.

Current state:
- Backend hardcodes 4 mock restaurants (Seoul Kitchen, Vietnam Express, Coffee Artistry, Golden Dragon)
- Location input is ignored; only "San Francisco" returns results
- No real proximity calculation

Goal:
- Geocode user's location input (address/city) using Nominatim
- Query Overpass API for real restaurants within 2km radius
- Parse OSM results and format into our results schema
- Calculate real distances using Haversine formula
- Sort results by distance (closest first), then by dish confidence

Changes needed:
1. Update backend/server.js:
   - Add geocodeAddress(location) → {lat, lng}
   - Add queryOverpass(lat, lng, radiusKm) → [restaurants]
   - Add calculateDistance(lat1, lng1, lat2, lng2) → miles
   - Refactor /search endpoint to use these functions
   - Keep validateDish() logic unchanged
   - Handle API rate limits with exponential backoff
   - Add error handling for geocoding failures

2. Dependencies:
   - axios (already installed)
   - No new packages needed

3. Testing:
   - Test with: "1600 Pennsylvania Ave, Washington DC" (should find restaurants nearby)
   - Test with: "Times Square, New York" (busy area, should return many results)
   - Test with: "Shibuya, Tokyo" (international support)
   - Verify distance calculations are accurate
   - Check error handling for invalid addresses

4. Expected behavior:
   - Input: {dish: "sushi", location: "Sydney Opera House"}
   - Output: Real restaurants near Sydney Opera House serving/mentioning sushi
   - Results ranked by: distance (primary), then dish confidence (secondary)

5. Rate limiting:
   - Nominatim: 1 req/sec
   - Overpass: public server has limits; add 2-second delays between queries
   - Implement exponential backoff on 429/503 responses

Notes:
- Keep the mock data as fallback for development
- Add logging for API calls (helps with debugging)
- Maintain backward compatibility with existing validateDish() function
```

### Phase 1: Real API Integration (Next Steps)
When extending this app, agents should:
1. **Add Google Places API** integration
   - Replace mock data in `backend/server.js`
   - Use `axios` to call Google Places API
   - Parse location to coordinates if needed
   - Filter restaurants by type (e.g., 'restaurant')

2. **Add Yelp Fusion API** for reviews
   - Query Yelp for restaurants in location
   - Extract review snippets for dish validation
   - Implement Yelp API authentication (API key)

3. **Improve menu extraction**
   - Integrate with menu APIs (e.g., Zomato, OpenTable)
   - Try website scraping as fallback (BeautifulSoup for Python wrapper, or Node.js package like `cheerio`)
   - Update validation logic in `validateDish()` function

### Phase 2: Advanced Features
- Add caching to reduce API calls
- Implement user preferences (dietary restrictions, cuisine type)
- Add restaurant ratings and hours of operation
- Build a "favorites" feature with local storage
- Add map view using Leaflet or Google Maps
- Implement pagination for large result sets

### Phase 3: Performance & Reliability
- Add error handling for rate-limited APIs
- Implement request queuing for multiple searches
- Add fallback data sources if primary API fails
- Cache restaurant data to reduce latency
- Add logging and monitoring

## Configuration & Environment Variables

### Backend (.env file)
```
PORT=5000
# Future additions:
# GOOGLE_PLACES_API_KEY=your_key_here
# YELP_API_KEY=your_key_here
# OPENWEATHER_API_KEY=your_key_here (for location)
```

### Frontend (.env or vite.config.js)
```javascript
// Currently uses proxy in vite.config.js to redirect /api requests to localhost:5001
// In production, update VITE_API_URL env var
```

## Testing the Application

### Manual Testing Flow
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Try these test cases:
   - Dish: "bibimbap", Location: "San Francisco" → Should show 4 results
   - Dish: "banh mi", Location: "San Francisco" → Should show 4 results
   - Dish: "flat white", Location: "San Francisco" → Should show 4 results
   - Dish: "pizza", Location: "New York" → Should return fewer results (non-SF)

### API Testing (curl/Postman)
```bash
curl -X POST http://localhost:5001/search \
  -H "Content-Type: application/json" \
  -d '{"dish": "bibimbap", "location": "San Francisco"}'

# Expected response:
# {
#   "success": true,
#   "query": {"dish": "bibimbap", "location": "San Francisco"},
#   "resultCount": 4,
#   "results": [...]
# }
```

### Health Check
```bash
curl http://localhost:5001/health
# Expected: {"status": "OK", "message": "Dish Finder backend is running"}
```

## Code Quality Standards

### Backend (`backend/server.js`)
- **Docstrings**: All functions have JSDoc comments
- **Error handling**: Try-catch blocks on all endpoints
- **Validation**: Input validation before processing
- **Constants**: Mock data at top of file for easy modification
- **Logging**: Console logs for debugging

### Frontend Components
- **Comments**: JSDoc for components and key functions
- **Props validation**: Descriptive function parameters
- **CSS organization**: Separate CSS modules for each component
- **Accessibility**: Semantic HTML, proper form labels, ARIA where needed

## Prompt Engineering Tips for Enhancements

### When asking AI to add features:
1. **Be specific about the API**: "Integrate Google Places API to search nearby restaurants"
2. **Specify the data structure**: "Return results with fields: name, address, lat, lng, price_level"
3. **Include error handling**: "Handle API rate limits with exponential backoff"
4. **Mention existing code**: "Update the `validateDish()` function in backend/server.js to also check..."
5. **Ask for tests**: "Add a test case for when the API returns no results"

### Example good prompts:
- "Add Yelp API integration to get real restaurant review snippets. Update validateDish() to score confidence based on how many times the dish appears."
- "Implement a cache layer using Redis to store restaurant data for 1 hour, keyed by location."
- "Add a Python backend wrapper using BeautifulSoup to scrape menus from restaurant websites when APIs aren't available."

## File Structure Reference
```
dish-finder-app/
├── backend/
│   ├── server.js          # Main Express app with /search endpoint
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # App styles
│   │   ├── main.jsx       # React entry point
│   │   ├── index.css      # Global styles
│   │   └── components/
│   │       ├── SearchForm.jsx       # Search input component
│   │       ├── SearchForm.css
│   │       ├── ResultsList.jsx      # Results container
│   │       ├── ResultsList.css
│   │       ├── ResultCard.jsx       # Individual result card
│   │       └── ResultCard.css
│   ├── index.html         # HTML entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration with API proxy
├── README.md              # User instructions
├── AGENTS.md              # This file
├── setup.sh               # macOS/Linux setup script
└── setup.bat              # Windows setup script
```

## Common Tasks

### Adding a New Result Field
1. Update mock data in `backend/server.js`
2. Update `/search` endpoint to include new field in results
3. Update `ResultCard.jsx` to display the new field
4. Add CSS styling to `.result-card` in `ResultCard.css`

### Changing Confidence Level Thresholds
Edit the `validateDish()` function in `backend/server.js`:
```javascript
// Example: require at least 2 mentions in reviews
const reviewMatches = reviews.filter(r => r.toLowerCase().includes(dishLower)).length;
if (reviewMatches >= 2) { /* confidence: medium */ }
```

### Adding a New Restaurant
Add to `mockRestaurants` array in `backend/server.js`:
```javascript
{
  id: '5',
  name: 'New Restaurant',
  address: '...',
  distance: '...',
  phone: '...',
  menuItems: [...],
  reviews: [...]
}
```

### Troubleshooting

### Frontend won't connect to backend
- Check backend is running: `curl http://localhost:5001/health`
- Check vite proxy config in `frontend/vite.config.js`
- Check CORS is enabled in backend (`cors()` middleware)

### No results returned
- Verify location parameter matches mock data (currently "San Francisco" or "sf")
- Check backend console for errors
- Try API directly with curl (see Testing section)

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)
- Rebuild frontend: `npm run build` then `npm run preview`
- Check CSS file is being imported (see `App.jsx` imports)

## Next Steps for Demo

1. Test full flow: form input → search → results display
2. Verify confidence levels appear correctly
3. Try different dish names to show validation logic
4. Show source code briefly (validateDish function)
5. Discuss potential real API integrations
