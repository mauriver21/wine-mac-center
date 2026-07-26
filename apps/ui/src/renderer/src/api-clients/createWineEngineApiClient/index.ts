import { axiosWineEngines } from '@utils/axiosWineEngines';

export const createWineEngineApiClient = () => {
  const list = async () => {
    const { data } = await axiosWineEngines.get<{
      engines: Array<{ version: string }>;
    }>('/index.json');

    return data.engines.map((engine) => engine.version);
  };

  return {
    list
  };
};
