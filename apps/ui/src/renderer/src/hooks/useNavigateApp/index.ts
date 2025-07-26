import { useNavigate } from 'react-router-dom';

export const useNavigateApp = () => {
  const navigate = useNavigate();

  const navigateToAppPipeline = (appConfigId: string | undefined) => {
    navigate(`/app-pipeline?appConfigId=${appConfigId}`);
  };

  return {
    navigateToAppPipeline
  };
};
