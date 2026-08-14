import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '155270289606-f82rrumdf164lp75620jgf1d6ic0ti72.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
