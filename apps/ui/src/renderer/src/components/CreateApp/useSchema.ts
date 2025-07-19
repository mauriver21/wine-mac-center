import { WineAppConfig } from '@interfaces/WineAppConfig';
import { fileMaxSize } from '@utils/fileMaxSize';
import { useMemo } from 'react';
import { schema, Schema } from 'reactjs-ui-form-fields';

export type FormSchema = Pick<
  WineAppConfig,
  'name' | 'engineVersion' | 'dxvkEnabled' | 'setupExecutablePath'
> & {
  artworkFile?: File;
  iconFile?: File;
  useWinetricks: boolean;
  winetricksVerbs?: Array<string>;
};

export const useSchema = () => {
  return useMemo<Schema<FormSchema>>(
    () =>
      schema.object({
        name: schema.string().required(),
        engineVersion: schema.string().required(),
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
        setupExecutablePath: schema.string().required(),
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
