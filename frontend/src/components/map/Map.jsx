import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './styles.css'

const mapContainerStyle = {
  height: '80vh',
  width: '100%',
};

const MapComponent = ({ countriesData }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch('/countries.geo.json') // json que cria os poligonos no mapa
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error('Error loading GeoJSON data:', error));
  }, []);

  const getCountryColor = (countryCode) => {
    if (countriesData.visited.includes(countryCode)) return '#4CAF50';  // VERDE -> visitado
    if (countriesData.wantToVisit.includes(countryCode)) return '#FFC107'; // AMARELO -> quer visitar
    return '#9E9E9E'; // CINZA padrao -> nao visitado
  };

  const countryStyle = (feature) => ({
    fillColor: getCountryColor(feature.properties.ISO_A3),  // codigo ISO_A3 pro país (de acordo com o json ali de cima)
    opacity: 1,
    weight: 2,
    color: 'white',
    fillOpacity: 0.7,
  });

  const onEachCountry = (feature, layer) => {
    layer.on({ // hover nos países
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: '#666', // cor mais escura um pouco
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: getCountryColor(feature.properties.ISO_A3),
          fillOpacity: 0.7, // volta p original
        });
      },
    });

    // mostrar nome do país qnd passa o mouse por cima
    layer.bindTooltip(feature.properties.name, {
      permanent: false,
      direction: 'center',
      className: 'country-tooltip',
    });
  };

  const bounds = L.latLngBounds(
    L.latLng(-60, -180), // Southwest corner (latitude, longitude)
    L.latLng(85, 180)    // Northeast corner (latitude, longitude)
  );

  return (
    <MapContainer 
      style={mapContainerStyle} 
      center={[20, 0]} 
      zoom={2} 
      scrollWheelZoom={true}
      minZoom={2}
      maxZoom={10}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON 
          data={geoJsonData} 
          style={countryStyle}
          onEachFeature={onEachCountry} // hover
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
