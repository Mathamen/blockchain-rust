import React, { useEffect, useState } from 'react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp'; // Add web3FromSource
import { getApi } from '../../features/substrateApi'; // Import the substrate API functions
import metadata from './metadata.json'; // Ensure the correct metadata file
import './styles.css';

const CountryForm = ({ setCountriesStatus }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [textInput, setTextInput] = useState('');
  const [visitStatus, setVisitStatus] = useState('visited');
  const [api, setApi] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

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
  
    const initializeApi = async () => {
      try {
        const apiInstance = await getApi();
        const { ContractPromise } = await import('@polkadot/api-contract');
        
        // Initialize contract with the contract address
        const contract = new ContractPromise(apiInstance, metadata, '5H7xVzeCv24CHVr5giGqYUpUXbKsWPfvvuuFX2sjHL8nCaED');
        
        setContract(contract);
        setApi(apiInstance);
      } catch (error) {
        console.error('Error initializing API or contract:', error);
      }
    };
  
    const fetchAccount = async () => {
      try {
        const extensions = await web3Enable('YourAppName');
        
        if (extensions.length === 0) {
          alert('Please install the Polkadot.js extension to interact with the DApp.');
          return;
        }
  
        const allAccounts = await web3Accounts();
        
        if (allAccounts.length > 0) {
          setAccount(allAccounts[0].address); // Set the first account as default
          const injector = await web3FromSource(allAccounts[0].meta.source);
          api.setSigner(injector.signer); // Set the signer for the API
        } else {
          alert('Please connect your Polkadot.js extension.');
        }
      } catch (error) {
        console.error('Error fetching account from Polkadot.js:', error);
      }
    };
  
    // Fetch countries, initialize the API, and fetch accounts
    fetchCountries();
    initializeApi();
    fetchAccount();
  }, []);
  

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleStatusChange = (event) => {
    setVisitStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!api || !contract || !account) {
      alert('API, contract, or account not initialized');
      return;
    }
  
    try {
      // Debugging
      console.log("Selected Country:", selectedCountry);
      console.log("Text Input:", textInput);
      console.log("Visit Status:", visitStatus);
      console.log("Account:", account);
  
      const gasLimit = -1; // Use automatic gas limit estimation
      const storageDepositLimit = null; // Can be null if not required
  
      // Query the contract to estimate gas and storage required
      const { gasRequired, storageDeposit } = await contract.query.setMessage(
        account, // Address of the sender
        { gasLimit, storageDepositLimit },
        selectedCountry,
        textInput,
        visitStatus,
        account // Sending account
      );
      
      console.log("Gas Required:", gasRequired.toString());
      console.log("Storage Deposit:", storageDeposit.toString());
  
      // Sudo: Wrap the contract call in a sudo transaction
      const sudoTx = api.tx.sudo.sudo(
        contract.tx.setMessage(
          { gasLimit: gasRequired, storageDepositLimit: storageDeposit.isChargeable ? storageDeposit.asCharge : null },
          selectedCountry,
          textInput,
          visitStatus,
          account
        )
      );
  
      // Send the transaction
      const hash = await sudoTx.signAndSend(account, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Transaction included at blockHash ${status.asInBlock}`);
        } else if (status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
        }
      });
  
      alert(`Transaction sent with hash: ${hash.toString()}`);
  
      // Update state and reset form
      setCountriesStatus((prevStatus) => ({
        ...prevStatus,
        [visitStatus]: [...prevStatus[visitStatus], selectedCountry],
      }));
  
      setSelectedCountry('');
      setTextInput('');
      setVisitStatus('visited');
    } catch (error) {
      console.error('Error signing transaction:', error);
      alert('Error signing transaction. Check console for details.');
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
