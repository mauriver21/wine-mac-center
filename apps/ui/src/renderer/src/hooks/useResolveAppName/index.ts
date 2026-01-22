import { useEnv } from '@hooks/useEnv';
import { useParams } from 'react-router-dom';

export const useResolveAppName = () => {
  const env = useEnv();
  const { appName = env.get().APP_NAME } = useParams();
  return appName;
};
