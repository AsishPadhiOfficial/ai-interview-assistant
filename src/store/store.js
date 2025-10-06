import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import interviewReducer from './interviewSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['candidates', 'currentCandidate'],
  migrate: (state) => {
    // Migration function to handle state changes
    // If state is corrupted or from old version, return initial state
    if (!state || typeof state !== 'object') {
      return {
        candidates: [],
        currentCandidate: null,
      };
    }
    return state;
  },
};

const persistedReducer = persistReducer(persistConfig, interviewReducer);

export const store = configureStore({
  reducer: {
    interview: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
