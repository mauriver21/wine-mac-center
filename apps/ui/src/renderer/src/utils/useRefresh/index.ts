import { useState } from 'react';
import { getTime } from 'reactjs-shared-ui';

export const useRefresh = () => {
  const [signal, setSignal] = useState(0);

  const refresh = () => {
    setSignal(getTime());
  };

  return { refresh, signal };
};
