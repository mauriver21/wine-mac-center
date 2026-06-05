import { useAppModel } from '@models/useAppModel';
import { openExternal as baseOpenExternal } from '@utils/openExternal';

export const useOpenExternal = () => {
  const appModel = useAppModel();

  const openExternal: typeof baseOpenExternal = async (...params) => {
    try {
      await baseOpenExternal(...params);
    } catch (error) {
      appModel.dispatchError(error);
    }
  };

  return {
    openExternal
  };
};
