import React, { useEffect, useState } from 'react';
import { getApi } from '../../features/substrateApi'; // Import the substrate API functions
import './styles.css'

const CountryForm = ({ setCountriesStatus }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [textInput, setTextInput] = useState('');
  const [visitStatus, setVisitStatus] = useState('visited'); // New state to handle visit status
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
    setSelectedCountry(event.target.value); // Store ISO code (cca3)
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleStatusChange = (event) => {
    setVisitStatus(event.target.value); // Update visit status
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!api) {
      alert('API not initialized');
      return;
    }

    try {
      const tx = api.tx.yourModuleName.yourExtrinsicMethod(selectedCountry, textInput);
      const hash = await tx.signAndSend(api.getAccounts().address); // Replace with actual account address

      alert(`Transaction sent with hash: ${hash.toString()}`);

      // Update parent component with selected country ISO and visit status
      setCountriesStatus((prevStatus) => ({
        ...prevStatus,
        [visitStatus]: [...prevStatus[visitStatus], selectedCountry],
      }));

      // Clear form after submission
      setSelectedCountry('');
      setTextInput('');
      setVisitStatus('visited');
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Error sending transaction');
    }
  };

  return (
    <div className="country-form">
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
            <option key={country.cca3} value={country.cca3}>
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

        {/* New dropdown for visit status */}
        <label htmlFor="visit-status">Visit Status:</label>
        <select id="visit-status" value={visitStatus} onChange={handleStatusChange}>
          <option value="visited">Visited</option>
          <option value="wantToVisit">Want to Visit</option>
          <option value="notVisited">Not Visited</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CountryForm;
