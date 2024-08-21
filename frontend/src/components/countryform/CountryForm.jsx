import React, { useEffect, useState } from 'react';

const CountryForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    // Fetch the list of countries from the REST Countries API
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        // Sort countries alphabetically by name
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Selected Country: ${selectedCountry}`);
  };

  return (
    <div>
      <h2>Select a Country</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          value={selectedCountry}
          onChange={handleChange}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.cca3} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CountryForm;
