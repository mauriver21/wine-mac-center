import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-ui-form-fields';

export type FormSchema = { winetricksVerbs?: Array<string> };

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        winetricksVerbs: schema.array().default([])
      }),
    []
  );
};
