import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../store';

interface providerProps {
  children: React.ReactNode
}

const MeProvider = ({ children }: providerProps) => {
  const { me } = useContext(StoreContext);
  useEffect(() => {
    me.fetchMeIfNeeded();
  });
  return (
    <>
      {children}
    </>
  );
};

export default MeProvider;
