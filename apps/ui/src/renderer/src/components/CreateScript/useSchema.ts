import { fileMaxSize } from '@utils/fileMaxSize';
import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-ui-form-fields';

export type FormSchema = {
  keyName: string;
  appName: string;
  engineVersion: string;
  version: string;
};

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        keyName: schema.string().required(),
        appName: schema.string().required(),
        version: schema.string().required().default('steam'),
        engineVersion: schema.string().required().default(''),
        dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(true),
        iconFile: schema.mixed<File>().test({
          name: 'fileSize',
          message: 'File exceeds 200kb',
          test: (file) => fileMaxSize(file, 200000)
        }),
        artworkFile: schema.mixed<File>().test({
          name: 'fileSize',
          message: 'File exceeds 1000kb',
          test: (file) => fileMaxSize(file, 1000000)
        }),
        installBy: schema.string().required().default('executable'),
        setupExecutablePath: schema
          .string()
          .when('installBy', { is: 'executable', then: (schema) => schema.required() }),
        appFolderPath: schema
          .string()
          .when('installBy', { is: 'path', then: (schema) => schema.required() }),
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
