import { compose, legacy_createStore as createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { loggerMiddleware } from './middleware/logger';
import { rootReducer } from './root.reducer';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['images'], // Only persist 'images' state
};

// Apply persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Set up middlewares
const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(loggerMiddleware); // Only add loggerMiddleware in development mode
}

// Compose enhancers for development (Redux DevTools)
const composeEnhancer = 
  (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Apply middleware and enhancers to store
const composedEnhancers = composeEnhancer(applyMiddleware(...middlewares));

// Create the Redux store with persisted reducer
export const store = createStore(persistedReducer, undefined, composedEnhancers);

// Create a persistor for Redux Persist
export const persistor = persistStore(store);
