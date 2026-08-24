import { useEffect, useRef } from 'react';

function VehicleMap({ lat, lng, name, address }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a simple SVG map as a fallback (no external dependency)
    const svg = `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <defs>
          <style>
            .map-bg { fill: #f0f0f0; }
            .map-grid { stroke: #e0e0e0; stroke-width: 1; }
            .map-marker { fill: #e74c3c; }
            .map-marker-shadow { fill: #c0392b; opacity: 0.3; }
            .map-text { font-size: 12px; fill: #333; text-anchor: middle; }
            .map-title { font-size: 14px; font-weight: bold; fill: #2c3e50; }
          </style>
        </defs>

        <rect class="map-bg" width="400" height="300"/>

        <line class="map-grid" x1="0" y1="150" x2="400" y2="150"/>
        <line class="map-grid" x1="200" y1="0" x2="200" y2="300"/>

        <circle class="map-marker-shadow" cx="200" cy="120" r="15"/>
        <circle class="map-marker" cx="200" cy="120" r="10"/>
        <text class="map-text" x="200" y="180">📍 Tow Yard Location</text>
        <text class="map-title" x="200" y="220">${name}</text>
        <text class="map-text" x="200" y="240">${address.substring(0, 35)}${address.length > 35 ? '...' : ''}</text>
        <text class="map-text" x="200" y="260">Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</text>

        <text class="map-text" x="20" y="20" text-anchor="start" style="font-size: 10px; fill: #999;">
          Map View (Interactive map coming soon)
        </text>
      </svg>
    `;

    mapContainer.current.innerHTML = svg;
  }, [lat, lng, name, address]);

  return (
    <div className="vehicle-map">
      <div ref={mapContainer} style={{ width: '100%', height: '300px' }}></div>
      <p className="map-note">
        View on Google Maps: <a href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">
          {address}
        </a>
      </p>
    </div>
  );
}

export default VehicleMap;
