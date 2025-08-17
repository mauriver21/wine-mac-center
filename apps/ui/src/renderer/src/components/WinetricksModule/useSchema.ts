import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-shared-ui/forms';

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
