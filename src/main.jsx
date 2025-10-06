import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, App as AntApp } from 'antd';
import App from './App.jsx';
import { store, persistor } from './store/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={null} 
        persistor={persistor}
        onBeforeLift={() => {
          return new Promise((resolve) => {
            // Small delay to ensure state is fully loaded
            setTimeout(resolve, 50);
          });
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
