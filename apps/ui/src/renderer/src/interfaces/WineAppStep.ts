import { ProcessStatus } from '@constants/enums';

export type WineAppStep = {
  id: string;
  key: string;
  keyArgs?: Record<string, string>;
  name: string;
  status: ProcessStatus;
  output: string;
};
