import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import { GlobalStyle } from './app/globalStyles';
import UserProvider from './providers/ContextUser';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <GlobalStyle />
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
