import { VersionDialogContext } from '@contexts/VersionDialogContext';
import { useContext } from 'react';

export const useVersionDialog = () => useContext(VersionDialogContext);
