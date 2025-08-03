import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-ui-form-fields';
import { v4 as uuid } from 'uuid';

export type FormSchema = {
  appConfigId: string;
  keyName?: string;
  dxvkEnabled: boolean;
  appName: string;
  engineVersion: string;
  version: string;
  winetricksVerbs?: Array<string | undefined>;
};

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        appConfigId: schema.string().required().default(uuid()),
        keyName: schema.string(),
        appName: schema.string().required(),
        version: schema.string().required().default('steam'),
        engineVersion: schema.string().required().default(''),
        dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(false),
        winetricksVerbs: schema.array().of(schema.string()).default([])
      }),
    []
  );
};
