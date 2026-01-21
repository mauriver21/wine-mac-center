import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as Launcher } from 'ui/app-launcher';

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    import.meta.env.PROD && navigate('/');
  }, []);

  return <Launcher />;
};
