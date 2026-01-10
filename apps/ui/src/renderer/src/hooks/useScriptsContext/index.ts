import { ScriptsContext } from '@contexts/ScriptsContext';
import { useContext } from 'react';

export const useScriptsContext = () => useContext(ScriptsContext);
