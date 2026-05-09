import { LoadingDialogContext } from '@contexts/LoadingDialogContext';
import { useContext } from 'react';

export const useLoadingDialog = () => useContext(LoadingDialogContext);
