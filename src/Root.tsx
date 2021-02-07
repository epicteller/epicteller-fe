import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import MeProvider from './component/Me/MeProvider';
import { StoreProvider } from './store';
import ThemeProvider from './theme';

export default () => (
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ThemeProvider>
          <MeProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </MeProvider>
        </ThemeProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>

);
