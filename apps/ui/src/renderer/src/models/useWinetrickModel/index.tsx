import { useDispatch } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { WinetrickActionType as ActionType } from '@constants/actionTypes';
import { useWinetrickApiClient } from '@api-clients/useWinetrickApiClient';
import { RootState } from '@interfaces/RootState';
import { WinetrickAction } from '@interfaces/WinetrickAction';
import { WinetrickState } from '@interfaces/WinetrickState';
import { useAppModel } from '@models/useAppModel';
import { objectMatchCriteria } from '@utils/objectMatchCriteria';

export const useWinetrickModel = () => {
  const appModel = useAppModel();
  const winetrickApiClient = useWinetrickApiClient();
  const dispatch = useDispatch<Dispatch<WinetrickAction>>();

  const listAll = async (params: { version: string; force?: boolean }) => {
    try {
      dispatchLoader({ listingAll: true });
      dispatchWinetricks(await winetrickApiClient.listAll(params));
    } catch (error) {
      appModel.dispatchError(error);
    } finally {
      dispatchLoader({ listingAll: false });
    }
  };

  const dispatchWinetricks = (winetricks: Partial<WinetrickState['winetricks']>) => {
    dispatch({ type: ActionType.LIST, winetricks });
  };

  const dispatchLoader = (loaders: Partial<WinetrickState['loaders']>) =>
    dispatch({ type: ActionType.LOADING, loaders });

  const selectWinetrickState = (state: RootState) => state.winetrickState;
  const selectWinetricks = createSelector(
    [
      selectWinetrickState,
      (_: RootState, filters: { verb: string }) => {
        return filters;
      }
    ],
    (winetrickState, filters) => {
      const verb = filters.verb;
      if (filters.verb) {
        const winetricks: Partial<typeof winetrickState.winetricks> = {};
        for (const [key, value] of Object.entries(winetrickState.winetricks)) {
          const foundVerbs = value.filter((item) => objectMatchCriteria(item, verb));
          if (foundVerbs.length) {
            winetricks[key] = foundVerbs;
          }
        }
        return winetricks;
      } else {
        return winetrickState.winetricks as Partial<typeof winetrickState.winetricks>;
      }
    }
  );

  return {
    listAll,
    selectWinetrickState,
    selectWinetricks
  };
};
