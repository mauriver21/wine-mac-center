import { LocalStorage } from '@interfaces/LocalStorage';
import { parseJson } from '@utils/parseJson';
import { useState } from 'react';

export const useLocalState = <T extends LocalStorage['key']>(key: T) => {
  const [_, setBaseState] =
    useState<Partial<Extract<LocalStorage, { key: T }>['data'] | undefined>>();

  const setState = (data: Partial<Extract<LocalStorage, { key: T }>['data']> | undefined) => {
    localStorage.setItem(key, JSON.stringify(data));
    setBaseState(data);
  };

  const getState = () =>
    (parseJson(localStorage.getItem(key)) || localStorage.getItem(key)) as
      | Extract<LocalStorage, { key: T }>['data']
      | undefined;

  return { getState, setState };
};
