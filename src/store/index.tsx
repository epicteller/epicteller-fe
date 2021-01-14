import React, { createContext, FunctionComponent } from 'react';
import { combatStore } from './combat';
import { globalNotificationStore } from './globalNotification';

export const stores = {
  globalNotificationStore,
  combatStore,
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
