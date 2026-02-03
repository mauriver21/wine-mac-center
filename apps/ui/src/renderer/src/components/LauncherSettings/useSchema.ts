import { schema, InferType } from 'reactjs-shared-ui/forms';

export const useSchema = () => {
  return schema.object({
    runMainExeOnStartup: schema.boolean().optional()
  });
};

export type FormSchema = InferType<ReturnType<typeof useSchema>>;
