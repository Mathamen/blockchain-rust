// src/substrateApi.js

import { ApiPromise, WsProvider } from '@polkadot/api';

let api = null;

export const connectToSubstrate = async () => {
  if (api) return api; // Return existing instance if already connected

  // Connect to the Substrate node
  const wsProvider = new WsProvider('ws://127.0.0.1:9944'); // Replace with your Substrate node URL
  api = await ApiPromise.create({ provider: wsProvider });

  return api;
};

export const getApi = async () => {
  if (!api) await connectToSubstrate();
  return api;
};
