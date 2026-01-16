import { useState } from 'react';

export const useLocalState = (key: string) => {
  const [_, setBaseState] = useState<string>('');

  const setState = (data: string) => {
    localStorage.setItem(key, data);
    setBaseState(data);
  };

  const state = localStorage.getItem(key);

  return [state, setState];
};
