import { useContext } from 'react';
import { StoreContext } from '../store/index';
import { Me } from '../store/me';

const useMe = (): Me | null => {
  const { me: meStore } = useContext(StoreContext);
  return meStore.me;
};

export default useMe;
