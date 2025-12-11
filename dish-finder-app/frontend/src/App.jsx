import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(null);

  const handleSearch = async (cuisine, location) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setQuery({ cuisine, location });

    try {
      // POST to /search with cuisine instead of dish
      const response = await axios.post('/api/search', {
        cuisine,
        location
      });

      setResults(response.data.results);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to search. Make sure the backend is running on http://localhost:5001'
      );
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ Cuisine Finder</h1>
        <p>Find restaurants serving your favorite cuisine</p>
      </header>

      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            Searching for restaurants...
          </div>
        )}

        {query && results.length > 0 && (
          <div className="results-section">
            <h2>Results for "{query.cuisine}" in {query.location}</h2>
            <p className="result-count">Found {results.length} restaurant(s)</p>
            <ResultsList results={results} />
          </div>
        )}

        {query && !loading && results.length === 0 && !error && (
          <div className="no-results">
            No restaurants found for your search.
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Cuisine Finder Demo • Backend runs on localhost:5001</p>
      </footer>
    </div>
  );
}

export default App;
