import { WineAppConfig } from '@interfaces/WineAppConfig';
import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-shared-ui/forms';

export type FormSchema = Pick<WineAppConfig, 'engineVersion'>;

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        engineVersion: schema.string().required()
      }),
    []
  );
};
