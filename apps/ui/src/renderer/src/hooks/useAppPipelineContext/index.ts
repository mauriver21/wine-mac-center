import { useContext } from 'react';
import { AppPipelineContext } from '@contexts/AppPipelineContext';

export const useAppPipelineContext = () => useContext(AppPipelineContext);
