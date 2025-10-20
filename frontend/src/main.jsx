import React from 'react'
import ReactDOM from 'react-dom/client'
import { initSentry } from './services/sentry.js'
import App from './App.jsx'

// Initialize Sentry before rendering the app
initSentry();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)