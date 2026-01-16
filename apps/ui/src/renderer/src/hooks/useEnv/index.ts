import { EnvContext } from '@contexts/EnvContext';
import { useContext } from 'react';

export const useEnv = () => useContext(EnvContext);
