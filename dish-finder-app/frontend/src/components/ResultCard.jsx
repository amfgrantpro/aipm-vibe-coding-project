import React from 'react';
import './ResultCard.css';

/**
 * ResultCard Component
 * Displays individual restaurant result with cuisine match info
 */
function ResultCard({ result }) {
  return (
    <div className="result-card">
      <div className="card-header">
        <h3 className="restaurant-name">{result.name}</h3>
        <span className="confidence-badge confidence-menu">
          ✓ Cuisine match
        </span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">📍 Address:</span>
          <span className="info-value">{result.address}</span>
        </div>

        <div className="info-row">
          <span className="info-label">📏 Distance:</span>
          <span className="info-value">{result.distance}</span>
        </div>

        <div className="info-row">
          <span className="info-label">🍴 Cuisine:</span>
          <span className="info-value" style={{ textTransform: 'capitalize' }}>
            {result.cuisine || 'International'}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">📞 Phone:</span>
          <span className="info-value">{result.phone}</span>
        </div>
      </div>

      <div className="card-footer">
        <small className="timestamp">Updated: {new Date(result.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}

export default ResultCard;
