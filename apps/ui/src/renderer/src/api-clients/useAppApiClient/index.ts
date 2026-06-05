import { axiosWineApps } from '@utils/axiosWineApps';

export const useAppApiClient = () => {
  const readVersion = async () => {
    const { data } = await axiosWineApps.get<{ version: string }>('/version');
    return data.version;
  };

  return { readVersion };
};
