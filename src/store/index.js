import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import destinationReducer from './destinationSlice';
import recommendReducer from './recommendSlice';
import plannerReducer from './plannerSlice';
import chatbotReducer from './chatbotSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  destinations: destinationReducer,
  recommendations: recommendReducer,
  planner: plannerReducer,
  chatbot: chatbotReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'chatbot', 'planner'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
