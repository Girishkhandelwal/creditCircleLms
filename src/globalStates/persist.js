// globalState/persist.js
import { persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dataReducer from './dataSlice';
import CryptoJS from 'crypto-js';

const encryptConfig = {
  secretKey: '1234567890',
};

const encryptTransform = createTransform(
  (inboundState, key) => {
    // Encrypt the state before storing
    const encryptedState = CryptoJS.AES.encrypt(JSON.stringify(inboundState), encryptConfig.secretKey).toString();
    return encryptedState;
  },
  (outboundState, key) => {
    // Decrypt the state when retrieving
    const decryptedState = CryptoJS.AES.decrypt(outboundState, encryptConfig.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedState);
  }
);

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptTransform],
};

const persistedReducer = persistReducer(persistConfig, dataReducer);

export default persistedReducer;
