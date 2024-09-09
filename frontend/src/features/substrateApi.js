import { ApiPromise, WsProvider } from '@polkadot/api';

let api = null;

export const connectToSubstrate = async () => {
  if (api) return api; // Return existing instance if already connected

  try {
    // Connect to the Substrate node
    const wsProvider = new WsProvider('ws://127.0.0.1:9944'); // Replace with your Substrate node URL
    api = await ApiPromise.create({ provider: wsProvider });

    // Ensure the API is ready before returning
    await api.isReady;
    console.log('Connected to Substrate node');
    
    return api;
  } catch (error) {
    console.error('Failed to connect to Substrate node:', error);
    throw new Error('Unable to establish connection');
  }
};

export const getApi = async () => {
  if (!api) {
    await connectToSubstrate();
  }
  return api;
};
