import { useContext } from 'react';
import { PidsContext } from '@contexts/PidsContext';

export const usePidsContext = () => useContext(PidsContext);
