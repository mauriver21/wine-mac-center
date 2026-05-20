import { LocalStorage } from '@interfaces/LocalStorage';
import { parseJson } from '@utils/parseJson';
import { useState } from 'react';

type StorageData<T extends LocalStorage['key']> = Extract<LocalStorage, { key: T }>['data'];

export const useLocalState = <T extends LocalStorage['key']>(key: T) => {
  type Data = StorageData<T>;

  const [, setBaseState] = useState<Partial<Data> | undefined>();

  const setState = (data: Partial<Data> | undefined) => {
    if (data === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }

    setBaseState(data);
  };

  const getState = (): Data | undefined => {
    const value = localStorage.getItem(key);

    if (!value) {
      return undefined;
    }

    return parseJson(value);
  };

  return { getState, setState };
};
