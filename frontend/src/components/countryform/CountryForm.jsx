import React, { useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const CountryForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [travelDetails, setTravelDetails] = useState('');
  const [api, setApi] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractResult, setContractResult] = useState('');

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
      const wsProvider = new WsProvider('wss://your-substrate-node-url');
      const apiInstance = await ApiPromise.create({ provider: wsProvider });
      setApi(apiInstance);

      // Replace with your contract's ABI and address
      const abi = /* Your contract ABI */;
      const contractAddress = 'your-contract-address';
      const contractInstance = new ContractPromise(apiInstance, abi, contractAddress);
      setContract(contractInstance);
    };

    fetchCountries();
    initializeApi();
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleTravelDetailsChange = (event) => {
    setTravelDetails(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!api || !contract) {
      alert('API or contract not initialized');
      return;
    }

    try {
      // Enable the extension
      await web3Enable('Your dApp Name');
      const accounts = await web3Accounts();

      if (accounts.length === 0) {
        console.error('No accounts found');
        return;
      }

      // Call the contract's constructor to create a new instance
      const { gasRequired } = await contract.query.new(
        accounts[0].address,
        { gasLimit: -1 },
        selectedCountry,
        travelDetails
      );

      // Adjust gas limit as needed
      const gasLimit = gasRequired.toNumber() * 1.2;

      // Send the actual transaction
      await contract.tx
        .new({ gasLimit }, selectedCountry, travelDetails)
        .signAndSend(accounts[0].address, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction included in block:', result.status.asInBlock.toHex());
          } else if (result.status.isFinalized) {
            console.log('Transaction finalized:', result.status.asFinalized.toHex());
            alert('Transaction successful!');
          }
        });

      // Call the get function to retrieve the stored data
      const { result } = await contract.query.get(accounts[0].address, {});
      setContractResult(result.toHuman());
    } catch (error) {
      console.error('Error interacting with contract:', error);
      alert('Error interacting with contract');
    }
  };

  return (
    <div>
      <h2>Select a Country and Enter Travel Details</h2>
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

        <label htmlFor="travel-details">Travel Details:</label>
        <input
          type="text"
          id="travel-details"
          value={travelDetails}
          onChange={handleTravelDetailsChange}
        />

        <button type="submit">Submit</button>
      </form>

      {contractResult && (
        <div>
          <h3>Contract Result:</h3>
          <p>{contractResult}</p>
        </div>
      )}
    </div>
  );
};



export default CountryForm;
