import { ProcessStatus } from '@constants/enums';

export type WineAppStep = {
  id: string;
  key: string;
  name: string;
  status: ProcessStatus;
  output: string;
};
