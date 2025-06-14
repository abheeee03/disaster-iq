"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map bounds to focus on and contain all disasters
const mapBounds = [
  [-60, -180],  // Southwest coordinates
  [80, 180]     // Northeast coordinates
];

export default function DisasterMap({ disasterType = "all", timeRange = "24h" }) {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchDisasters() {
      try {
        setLoading(true);
        
        // Construct the API URL with query parameters
        const apiUrl = `/api/disasters?type=${disasterType}&timeRange=${timeRange}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setDisasters(data.data);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching disaster data:", err);
        setError(err.message);
        setDisasters([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDisasters();
  }, [disasterType, timeRange]);

  // If we're loading or have an error, display a message
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <p>Loading disaster data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted/20">
        <div className="text-center text-red-500">
          <p>Error loading disaster data: {error}</p>
          <p className="mt-2 text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer 
        style={{ height: '100%', width: '100%' }} 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true}
        maxBounds={mapBounds}
        minZoom={1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {disasters.length > 0 && <MapController disasters={disasters} />}
        
        {disasters.map(disaster => {
          // Check if valid coordinates exist
          if (!disaster.lat || !disaster.lng) {
            return null;
          }
          
          // Choose marker style based on disaster type and severity
          const markerColor = getMarkerColor(disaster.severity, disaster.type);
          const markerSize = getMarkerSize(disaster);
          
          return (
            <CircleMarker 
              key={disaster.id}
              center={[disaster.lat, disaster.lng]}
              radius={markerSize}
              pathOptions={{
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{disaster.name}</h3>
                  <div className="text-sm">
                    <p className="capitalize">Type: {disaster.type}</p>
                    {disaster.magnitudeValue && (
                      <p>Magnitude: {disaster.magnitudeValue} {disaster.magnitudeUnit}</p>
                    )}
                    {disaster.updatedAt && (
                      <p>Last updated: {new Date(disaster.updatedAt).toLocaleString()}</p>
                    )}
                    <p className="mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeClass(disaster.severity)}`}>
                        {disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1)}
                      </span>
                    </p>
                    
                    {disaster.sources && disaster.sources.length > 0 && (
                      <div className="mt-2 text-xs">
                        <p>Source: {disaster.sources[0].id}</p>
                        <a 
                          href={disaster.sources[0].url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View source details
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        
        {disasters.length === 0 && !loading && !error && (
          <NoDataOverlay message={`No ${disasterType === 'all' ? 'disasters' : disasterType} found for the selected time period.`} />
        )}
      </MapContainer>
    </div>
  );
}

function NoDataOverlay({ message }) {
  const map = useMap();
  
  // Center the message in the map
  const containerPoint = map.getSize().divideBy(2);
  const latLng = map.containerPointToLatLng(containerPoint);
  
  return (
    <Marker position={latLng} opacity={0}>
      <Popup autoOpen={true} closeButton={false}>
        <div className="text-center py-2 px-4">
          <p>{message}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function MapController({ disasters }) {
  const map = useMap();
  
  useEffect(() => {
    if (disasters.length > 0) {
      const validPoints = disasters
        .filter(d => d.lat && d.lng)
        .map(d => [d.lat, d.lng]);
      
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 5,
          });
        }
      }
    }
  }, [disasters, map]);
  
  return null;
}

// Helper functions for marker styling
function getMarkerColor(severity, type) {
  // First check severity
  if (severity === 'critical') return '#dc2626'; // red-600
  if (severity === 'warning') return '#ea580c';  // orange-600
  if (severity === 'moderate') return '#d97706'; // amber-600
  if (severity === 'low') return '#16a34a';      // green-600
  
  // If no severity match, use type
  switch(type) {
    case 'wildfire': return '#dc2626';     // red-600
    case 'earthquake': return '#ca8a04';   // yellow-600
    case 'flood': return '#2563eb';        // blue-600
    case 'storm': return '#7c3aed';        // violet-600
    case 'volcano': return '#ea580c';      // orange-600
    default: return '#3b82f6';            // blue-500
  }
}

function getMarkerSize(disaster) {
  // Base size by severity
  const baseSizes = {
    critical: 14,
    warning: 12,
    moderate: 10,
    low: 8,
    unknown: 10
  };
  
  const severity = disaster.severity || 'unknown';
  let size = baseSizes[severity];
  
  // Adjust by magnitude if available
  if (disaster.magnitudeValue) {
    if (disaster.type === 'earthquake') {
      // Earthquake magnitudes are typically 1-10
      size *= Math.min(disaster.magnitudeValue / 4, 2.5);
    } else if (disaster.type === 'storm' && disaster.magnitudeUnit === 'kts') {
      // Wind speeds in knots, typically 20-150
      size *= Math.min(disaster.magnitudeValue / 40, 2.5);
    } else if (disaster.type === 'wildfire' && disaster.magnitudeUnit === 'acres') {
      // Fire sizes can be very large
      size *= Math.min(Math.log10(disaster.magnitudeValue / 100), 2.5);
    } else {
      // Generic scaling
      size *= Math.min(disaster.magnitudeValue / 100, 2.5);
    }
  }
  
  return Math.max(size, 6); // Ensure minimum visibility
}

function getStatusBadgeClass(severity) {
  switch(severity) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'moderate': return 'bg-orange-100 text-orange-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-blue-100 text-blue-800';
  }
} 