import React, { useEffect, useState } from 'react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { getApi } from '../../features/substrateApi'; // Import the substrate API functions
import metadata from './metadata.json'; // Ensure the correct metadata file

const FetchMessages = () => {
  const [api, setApi] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [messages, setMessages] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const apiInstance = await getApi();
        const { ContractPromise } = await import('@polkadot/api-contract');
        
        // Initialize contract with the contract address
        const contractInstance = new ContractPromise(apiInstance, metadata, '5H7xVzeCv24CHVr5giGqYUpUXbKsWPfvvuuFX2sjHL8nCaED');
        
        setContract(contractInstance);
        setApi(apiInstance);
      } catch (error) {
        console.error('Error initializing API or contract:', error);
      }
    };

    const fetchAccount = async () => {
      if (!api) return;

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

    // Initialize API and fetch account
    initializeApi().then(fetchAccount);
  }, [api]);

  const fetchMessages = async () => {
    if (!api || !contract || !account) {
      alert('API, contract, or account not initialized');
      return;
    }
  
    setLoading(true);
  
    try {
      // Debugging: Log contract query methods
      console.log("Contract query methods:", contract.query);
  
      if (!contract.query.fetch) {
        throw new Error('Contract does not have fetch function.');
      }
  
      // Call the contract's fetch function
      const result = await contract.query.fetch(
        account,
        { gasLimit: -1 } // Automatic gas estimation
      );
  
      // Debugging: Log the result to inspect its structure
      console.log("Contract fetch result:", result);
  
      if (result && result.output && result.output.isOk) {
        setMessages(result.output.toString());
      } else {
        setMessages('No messages found or error occurred.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages('Error fetching messages.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fetch-messages">
      <h2>Fetch Messages from Blockchain</h2>
      <button onClick={fetchMessages} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Messages'}
      </button>
      <div className="messages">
        <h3>Messages:</h3>
        <p>{messages}</p>
      </div>
    </div>
  );
};

export default FetchMessages;
