import { useMediaQuery, createMuiTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@material-ui/core';
import React, { useMemo } from 'react';

export interface ProviderProps {
  children?: React.ReactNode
}

const ThemeProvider: React.FunctionComponent = ({ children }: ProviderProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () => createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    }),
    [prefersDarkMode],
  );
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
