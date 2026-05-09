import { DEFAULT_WINETRICKS_VERSION } from '@constants/constants';
import { useWineAppContext } from '@hooks/useWineAppContext';
import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-shared-ui/forms';

export type FormSchema = { winetricksVerbs?: Array<string> };

export const useSchema = () => {
  const { wineApp } = useWineAppContext() || {};
  const config = wineApp?.getAppConfig();

  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        winetricksVerbs: schema.array().default([]),
        winetricksVersion: schema
          .string()
          .default(config?.winetricks?.version || DEFAULT_WINETRICKS_VERSION)
      }),
    []
  );
};
