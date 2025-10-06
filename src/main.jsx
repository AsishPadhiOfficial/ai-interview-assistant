import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, App as AntApp } from 'antd';
import App from './App.jsx';
import { store, persistor } from './store/store';
import './index.css';

// Error fallback component
const ErrorFallback = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Something went wrong</h2>
    <p>Please clear your browser cache and refresh the page.</p>
    <button onClick={() => {
      localStorage.clear();
      window.location.reload();
    }}>
      Clear Cache & Reload
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={<div>Loading...</div>} 
        persistor={persistor}
        onBeforeLift={() => {
          // Clear corrupted state if needed
          try {
            const persistedState = localStorage.getItem('persist:root');
            if (persistedState) {
              JSON.parse(persistedState);
            }
          } catch (e) {
            console.error('Corrupted state detected, clearing...', e);
            localStorage.removeItem('persist:root');
          }
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#667eea',
              borderRadius: 6,
            },
          }}
        >
          <AntApp>
            <App />
          </AntApp>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
