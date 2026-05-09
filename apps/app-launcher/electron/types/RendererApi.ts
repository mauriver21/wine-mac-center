import { Api } from './Api';

export type RendererApi = {
  [K in keyof Api]: (...args: Parameters<Api[K]>) => ReturnType<Api[K]>;
};
