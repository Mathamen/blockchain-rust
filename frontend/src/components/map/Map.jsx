import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mapContainerStyle = {
  height: '80vh',
  width: '100%',
};

const MapComponent = ({ countriesData }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON file from the public folder
    fetch('/countries.geo.json')  // This will load from the public directory
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error('Error loading GeoJSON data:', error));
  }, []);

  const getCountryColor = (countryCode) => {
    if (countriesData.visited.includes(countryCode)) return '#4CAF50';  // Green for visited
    if (countriesData.wantToVisit.includes(countryCode)) return '#FFC107'; // Yellow for want to visit
    return '#9E9E9E'; // Gray for not visited
  };

  const countryStyle = (feature) => ({
    fillColor: getCountryColor(feature.properties.ISO_A3),  // Use ISO_A3 code for country
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7,
  });

  return (
    <MapContainer style={mapContainerStyle} center={[20, 0]} zoom={2} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON data={geoJsonData} style={countryStyle} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
