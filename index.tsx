
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';

import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <AdminProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
          <Toaster position="top-right" />
        </AdminProvider>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>
);
