import React, { useState } from 'react';
import MapComponent from '../../components/map/Map';
import CountryForm from '../../components/countryform/CountryForm';
import '../../css/global.css'

const Home = () => {
  const [countriesStatus, setCountriesStatus] = useState({
    visited: [],
    wantToVisit: [],
    notVisited: [],
  });

  return (
    <div className="container">
      <CountryForm setCountriesStatus={setCountriesStatus} />
      <div className="map-container">
        <MapComponent countriesData={countriesStatus} />
      </div>
    </div>
  );
};

export default Home;
