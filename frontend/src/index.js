import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the "root" div in your index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your main App component into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);