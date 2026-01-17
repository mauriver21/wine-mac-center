import { ScriptOperation } from '@constants/enums';
import { fileMaxSize } from '@utils/fileMaxSize';
import { isAlphanumeric } from '@utils/isAlphanumeric';
import { isDownloadableURL } from '@utils/isDownloadableURL';
import { isURL } from '@utils/isURL';
import { scriptExists } from '@utils/scriptExists';
import { schema, InferType } from 'reactjs-shared-ui/forms';

export const DEFAULT_PIPELINE_SCRIPT = {
  operation: ScriptOperation.DOWNLOAD,
  url: ''
} as const;

export const useSchema = () => {
  return schema.object({
    originalAppName: schema.string().optional().default(''),
    appName: schema
      .string()
      .required()
      .test({
        name: 'isAlphanumeric',
        message: 'Invalid characters',
        test: (appName) => isAlphanumeric(appName)
      })
      .test({
        name: 'appExists',
        message: 'App name is already taken',
        test: async (appName, context) => {
          // Skips validation on update operation.
          if (context.parent.originalAppName === appName) {
            return true;
          }
          const exists = await scriptExists(appName);
          const isValid = exists === false;
          return isValid;
        }
      })
      .transform((value) => value.trim()),
    engineVersion: schema.string().required().default(''),
    dxvkEnabled: schema.boolean().required().oneOf([true, false]).default(false),
    winetricksVerbs: schema.array().of(schema.string().required()).default([]),
    iconFile: schema.mixed<File>().test({
      name: 'fileSize',
      message: 'File exceeds 600kb',
      test: (file) => fileMaxSize(file, 600000)
    }),
    artworkFile: schema.mixed<File>().test({
      name: 'fileSize',
      message: 'File exceeds 2000kb',
      test: (file) => fileMaxSize(file, 2000000)
    }),
    pipelineScripts: schema
      .array(
        schema.object({
          operation: schema
            .string()
            .oneOf([
              ScriptOperation.DOWNLOAD,
              ScriptOperation.COPY,
              ScriptOperation.RUN_WINDOWS_EXE,
              ScriptOperation.DECOMPRESS,
              ScriptOperation.SET_MAIN_EXE,
              ScriptOperation.MOUNT_DISK_IMAGE,
              ScriptOperation.REMOVE,
              ScriptOperation.DOWNLOAD_STEAM_APP
            ])
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
          baseExePath: schema.string().when('operation', {
            is: ScriptOperation.RUN_WINDOWS_EXE,
            then: (schema) => schema.required()
          }),
          exePath: schema.string().when('operation', {
            is: ScriptOperation.RUN_WINDOWS_EXE,
            then: (schema) => schema.required()
          }),
          path: schema.string().when('operation', {
            is: ScriptOperation.DECOMPRESS,
            then: (schema) => schema.required()
          }),
          removePath: schema.string().when('operation', {
            is: ScriptOperation.REMOVE,
            then: (schema) => schema.required()
          }),
          from: schema.string().when('operation', {
            is: ScriptOperation.COPY,
            then: (schema) => schema.required()
          }),
          target: schema.string().when('operation', {
            is: ScriptOperation.COPY,
            then: (schema) => schema.required()
          }),
          mainExePath: schema.string().when('operation', {
            is: ScriptOperation.SET_MAIN_EXE,
            then: (schema) => schema.required()
          }),
          exeFlags: schema.string().when('operation', {
            is: ScriptOperation.SET_MAIN_EXE,
            then: (schema) => schema.optional()
          }),
          diskImagePath: schema.string().when('operation', {
            is: ScriptOperation.MOUNT_DISK_IMAGE,
            then: (schema) => schema.required()
          }),
          steamAppId: schema.string().when('operation', {
            is: ScriptOperation.DOWNLOAD_STEAM_APP,
            then: (schema) => schema.required()
          }),
          installDirName: schema.string().when('operation', {
            is: ScriptOperation.DOWNLOAD_STEAM_APP,
            then: (schema) => schema.required()
          })
        })
      )
      .default([DEFAULT_PIPELINE_SCRIPT])
  });
};

export type FormSchema = InferType<ReturnType<typeof useSchema>>;
