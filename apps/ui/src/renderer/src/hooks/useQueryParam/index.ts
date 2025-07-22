import { useLocation } from 'react-router-dom';

export const useQueryParam = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};
