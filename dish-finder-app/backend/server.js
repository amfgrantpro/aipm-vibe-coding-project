import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// GEOCODING & LOCATION SERVICES (OpenStreetMap Nominatim + Overpass)
// ============================================================================

/**
 * Geocode a location string to latitude and longitude using Nominatim
 * @param {string} location - Address or location name
 * @returns {Promise<{lat: number, lng: number}>} Coordinates
 */
async function geocodeAddress(location) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'CuisineFinder/1.0'
      },
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error(`Could not geocode location: ${location}`);
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Start latitude
 * @param {number} lng1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lng2 - End longitude
 * @returns {number} Distance in miles
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

/**
 * Map user-friendly cuisine names to Overpass regex
 */
function getCuisineRegex(cuisine) {
  const c = cuisine.toLowerCase().trim();
  const map = {
    'italian': 'italian|pizza|pasta',
    'korean': 'korean',
    'vietnamese': 'vietnamese|asian',
    'ethiopian': 'ethiopian|african',
    'mexican': 'mexican|taco',
    'indian': 'indian|curry',
    'japanese': 'japanese|sushi|ramen',
    'chinese': 'chinese|asian',
    'thai': 'thai|asian',
    'french': 'french|bistro',
    'greek': 'greek|mediterranean',
    'american': 'american|burger|steak',
    'german': 'german'
  };

  // Return mapped regex or fallback to the input string itself (safe-ish regex)
  // We strip special chars to prevent query injection/breaking
  return map[c] || c.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * Query Overpass API for restaurants near coordinates filtering by cuisine
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {string} cuisineRegex - Regex for cuisine tag
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Array>} Array of restaurants
 */
async function queryOverpass(lat, lng, cuisineRegex, radiusKm = 2) {
  try {
    // Overpass API query for restaurants with cuisine filter
    // We use [~"key"~"regex",i] for case-insensitive regex matching
    const query = `
      [out:json];
      (
        node["amenity"="restaurant"]["cuisine"~"${cuisineRegex}",i](around:${radiusKm * 1000},${lat},${lng});
        way["amenity"="restaurant"]["cuisine"~"${cuisineRegex}",i](around:${radiusKm * 1000},${lat},${lng});
        relation["amenity"="restaurant"]["cuisine"~"${cuisineRegex}",i](around:${radiusKm * 1000},${lat},${lng});
      );
      out geom;
    `;

    console.log(`Sending Overpass query with regex: ${cuisineRegex}`);

    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    });

    const restaurants = [];

    if (!response.data || !response.data.elements) {
      return [];
    }

    response.data.elements.forEach(element => {
      // Must have a name to be useful
      if (element.tags && element.tags.name) {

        // Get coordinates
        let elemLat, elemLng;
        if (element.lat !== undefined && element.lon !== undefined) {
          elemLat = element.lat;
          elemLng = element.lon;
        } else if (element.center) {
          elemLat = element.center.lat;
          elemLng = element.center.lon;
        } else if (element.geometry && element.geometry.length > 0) {
          elemLat = element.geometry[0].lat;
          elemLng = element.geometry[0].lon;
        } else {
          return;
        }

        const distance = calculateDistance(lat, lng, elemLat, elemLng);

        restaurants.push({
          id: element.id.toString(),
          name: element.tags.name,
          address: element.tags['addr:full'] ||
            `${element.tags['addr:street'] || 'Street'}, ${element.tags['addr:city'] || 'City'}`,
          lat: elemLat,
          lng: elemLng,
          distance: `${distance} miles`,
          phone: element.tags.phone || 'N/A',
          website: element.tags.website || null,
          cuisine: element.tags.cuisine || 'Inferred from search',
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log(`Found ${restaurants.length} restaurants near lat=${lat}, lng=${lng}`);
    return restaurants;
  } catch (error) {
    console.error('Overpass query error:', error.message);
    throw new Error('Could not query restaurants from OpenStreetMap');
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Search endpoint
 * POST /search
 * Body: { cuisine, location }
 * Returns: Array of restaurants matching cuisine
 */
app.post('/search', async (req, res) => {
  try {
    const { cuisine, location } = req.body;

    // Validation
    if (!cuisine || !location) {
      return res.status(400).json({
        error: 'Missing required fields: cuisine and location'
      });
    }

    if (cuisine.trim().length === 0 || location.trim().length === 0) {
      return res.status(400).json({
        error: 'Cuisine and location cannot be empty'
      });
    }

    console.log(`🔍 Searching for "${cuisine}" cuisine near "${location}"`);

    // Geocode the location
    console.log(`📍 Geocoding location: ${location}`);
    const coordinates = await geocodeAddress(location);
    console.log(`✓ Found coordinates: lat=${coordinates.lat}, lng=${coordinates.lng}`);

    // Determine cuisine regex
    const cuisineRegex = getCuisineRegex(cuisine);

    // Query Overpass for restaurants
    console.log(`🏪 Querying Overpass API...`);
    let restaurants = await queryOverpass(coordinates.lat, coordinates.lng, cuisineRegex, 2);

    if (restaurants.length === 0) {
      console.log('⚠️  No restaurants found, expanding search radius to 5km...');
      restaurants = await queryOverpass(coordinates.lat, coordinates.lng, cuisineRegex, 5);
    }

    // Sort by distance (closest first)
    restaurants.sort((a, b) => {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    });

    res.json({
      success: true,
      query: { cuisine, location },
      resultCount: restaurants.length,
      results: restaurants
    });

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(400).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cuisine Finder backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍽️  Cuisine Finder backend running on http://localhost:${PORT}`);
  console.log(`📍 Using OpenStreetMap (Nominatim) for geocoding`);
  console.log(`🏪 Using Overpass API for restaurant data`);
  console.log(`📍 POST /search - Search for restaurants by cuisine`);
  console.log(`🏥 GET /health - Health check`);
});
