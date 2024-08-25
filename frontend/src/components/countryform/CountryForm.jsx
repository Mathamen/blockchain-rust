import React, { useEffect, useState } from 'react';
import { getApi } from '../../features/substrateApi'; // Import the substrate API functions

const CountryForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [textInput, setTextInput] = useState('');
  const [api, setApi] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
    
    const initializeApi = async () => {
      const apiInstance = await getApi();
      setApi(apiInstance);
    };
    
    initializeApi();
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!api) {
      alert('API not initialized');
      return;
    }

    try {
      const tx = api.tx.yourModuleName.yourExtrinsicMethod(selectedCountry, textInput); // Replace with your actual module and extrinsic method
      const hash = await tx.signAndSend(api.getAccounts().address); // Replace `address` with actual account address if necessary

      alert(`Transaction sent with hash: ${hash.toString()}`);
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Error sending transaction');
    }
  };

  return (
    <div>
      <h2>Select a Country</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.cca3} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
        </select>

        <label htmlFor="text-input">Text Input:</label>
        <input
          type="text"
          id="text-input"
          value={textInput}
          onChange={handleTextChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CountryForm;
