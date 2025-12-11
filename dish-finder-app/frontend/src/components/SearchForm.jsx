import React, { useState } from 'react';
import './SearchForm.css';

/**
 * SearchForm Component
 * Form for entering cuisine type and location
 */
function SearchForm({ onSearch, loading }) {
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cuisine.trim() && location.trim()) {
      onSearch(cuisine.trim(), location.trim());
    }
  };

  // Example searches for quick demo
  const fillExample = (exampleCuisine, exampleLocation) => {
    setCuisine(exampleCuisine);
    setLocation(exampleLocation);
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cuisine">Cuisine Type</label>
          <input
            id="cuisine"
            type="text"
            placeholder="e.g., Korean, Vietnamese, Italian"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !cuisine.trim() || !location.trim()} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="quick-examples">
        <p>Quick examples:</p>
        <div className="example-buttons">
          <button
            onClick={() => fillExample('Korean', 'Berlin')}
            disabled={loading}
            className="example-btn"
          >
            Korean
          </button>
          <button
            onClick={() => fillExample('Vietnamese', 'Berlin')}
            disabled={loading}
            className="example-btn"
          >
            Vietnamese
          </button>
          <button
            onClick={() => fillExample('Italian', 'Rome')}
            disabled={loading}
            className="example-btn"
          >
            Italian
          </button>
          <button
            onClick={() => fillExample('Ethiopian', 'London')}
            disabled={loading}
            className="example-btn"
          >
            Ethiopian
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchForm;
