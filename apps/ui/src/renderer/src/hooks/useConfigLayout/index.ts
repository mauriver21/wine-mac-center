import { ConfigLayoutContext } from '@contexts/ConfigLayoutContext';
import { useContext } from 'react';

export const useConfigLayout = () => useContext(ConfigLayoutContext);
