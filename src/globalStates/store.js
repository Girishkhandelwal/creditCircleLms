// globalState/store.js
import { configureStore } from '@reduxjs/toolkit';
import persistedReducer from './persist';
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});
const persistor = persistStore(store);

export { store, persistor };
