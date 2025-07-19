import { AppConfigContext } from '@contexts/AppConfigContext';
import { useContext } from 'react';

export const useAppConfigContext = () => useContext(AppConfigContext);
