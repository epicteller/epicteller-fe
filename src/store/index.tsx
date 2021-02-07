import React, { createContext, FunctionComponent } from 'react';
import { combat } from './combat';
import { me } from './me';
import { globalNotification } from './globalNotification';

export const stores = {
  globalNotification,
  combat,
  me,
};

export const StoreContext = createContext(stores);

export interface ProviderProps {
  children?: React.ReactNode
}

export const StoreProvider: FunctionComponent = ({ children }: ProviderProps) => (
  <StoreContext.Provider value={stores}>
    {children}
  </StoreContext.Provider>
);
