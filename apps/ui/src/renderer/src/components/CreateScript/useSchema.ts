import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-ui-form-fields';
import { v4 as uuid } from 'uuid';

export type FormSchema = {
  appConfigId: string;
  keyName: string;
  appName: string;
  engineVersion: string;
  version: string;
};

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        appConfigId: schema.string().required().default(uuid()),
        keyName: schema.string().required(),
        appName: schema.string().required(),
        version: schema.string().required().default('steam'),
        engineVersion: schema.string().required().default(''),
        dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(true),
        setupExecutableURL: schema.string().when('setupExecutableStrategy', {
          is: 'downloadSetupExecutable',
          then: (schema) => schema.required()
        }),
        useWinetricks: schema.bool().required().default(false),
        winetricksVerbs: schema
          .array()
          .when('useWinetricks', {
            is: true,
            then: (arrSchema) => arrSchema.of(schema.string())
          })
          .default([])
      }),
    []
  );
};
