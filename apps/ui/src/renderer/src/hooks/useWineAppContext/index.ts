import { WineAppContext } from '@contexts/WineAppContext';
import { useContext } from 'react';

export const useWineAppContext = () => useContext(WineAppContext);
