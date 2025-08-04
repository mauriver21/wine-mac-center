import { ScriptOperation } from '@constants/enums';
import { schema, InferType } from 'reactjs-ui-form-fields';
import { v4 as uuid } from 'uuid';

const schemaObject = schema.object({
  appConfigId: schema.string().required().default(uuid()),
  keyName: schema.string().required(),
  appName: schema.string().required(),
  version: schema.string().required().default('steam'),
  engineVersion: schema.string().required().default(''),
  dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(false),
  winetricksVerbs: schema.array().of(schema.string()).default([]),
  pipelineScripts: schema.array().default([
    {
      name: 'Download setup executable',
      operation: ScriptOperation.DOWNLOAD,
      target: ''
    }
  ])
});

export type FormSchema = InferType<typeof schemaObject>;

export const useSchema = () => {
  return schemaObject;
};
