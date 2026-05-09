import { ProcessStatus } from '@constants/enums';

export type WineAppStep = {
  id: string;
  name: string;
  status: ProcessStatus;
  output: string;
};
