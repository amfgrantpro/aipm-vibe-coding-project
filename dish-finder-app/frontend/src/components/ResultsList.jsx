import React from 'react';
import ResultCard from './ResultCard';
import './ResultsList.css';

/**
 * ResultsList Component
 * Displays search results as a list of restaurant cards
 */
function ResultsList({ results }) {
  return (
    <div className="results-list">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}

export default ResultsList;
