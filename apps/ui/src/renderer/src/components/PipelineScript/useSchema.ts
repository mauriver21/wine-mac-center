import { ScriptOperation } from '@constants/enums';
import { isDownloadableURL } from '@utils/isDownloadableURL';
import { isURL } from '@utils/isURL';
import { schema, InferType } from 'reactjs-shared-ui/forms';
import { v4 as uuid } from 'uuid';

export const DEFAULT_PIPELINE_SCRIPT = {
  operation: ScriptOperation.DOWNLOAD,
  url: ''
} as const;

const schemaObject = schema.object({
  appConfigId: schema.string().required().default(uuid()),
  keyName: schema.string().required(),
  appName: schema.string().required(),
  engineVersion: schema.string().required().default(''),
  dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(false),
  winetricksVerbs: schema.array().of(schema.string()).default([]),
  pipelineScripts: schema
    .array(
      schema.object({
        operation: schema
          .string()
          .oneOf([ScriptOperation.DOWNLOAD, ScriptOperation.COPY, ScriptOperation.RUN_WINDOWS_EXE])
          .required(),
        url: schema.string().when('operation', {
          is: ScriptOperation.DOWNLOAD,
          then: (schema) =>
            schema
              .required()
              .test({
                name: 'isURL',
                message: 'Invalid URL',
                test: (url) => isURL(url || '')
              })
              .test({
                name: 'isDownloadableURL',
                message: 'URL not downloadable',
                test: async (url) => await isDownloadableURL(url || '')
              })
        }),
        exePath: schema.string().when('operation', {
          is: ScriptOperation.RUN_WINDOWS_EXE,
          then: (schema) => schema.required()
        })
      })
    )
    .default([DEFAULT_PIPELINE_SCRIPT])
});

export type FormSchema = InferType<typeof schemaObject>;

export const useSchema = () => {
  return schemaObject;
};
