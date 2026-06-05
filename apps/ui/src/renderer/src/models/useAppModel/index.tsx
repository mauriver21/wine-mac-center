import { useAppApiClient } from '@api-clients/useAppApiClient';
import { AppActionType as ActionType } from '@constants/actionTypes';
import { VERSION } from '@constants/constants';
import { VersionDialogAction } from '@constants/enums';
import { useLoadingDialog } from '@hooks/useLoadingDialog';
import { useVersionDialog } from '@hooks/useVersionDialog';
import { AppAction } from '@interfaces/AppAction';
import { RootState } from '@interfaces/RootState';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { handleError } from '@utils/handleError';
import { useDispatch } from 'react-redux';
import { useI18n } from 'reactjs-shared-ui/i18next';

/**
 * Hook for handling global state and configurations of main ui application.
 */
export const useAppModel = () => {
  const { t } = useI18n();
  const dialog = useLoadingDialog();
  const versionDialog = useVersionDialog();
  const appApiClient = useAppApiClient();
  const dispatch = useDispatch<Dispatch<AppAction>>();

  const checkForUpdates = async () => {
    let version = '';
    try {
      dialog.open({ message: t('checkingForUpdates') });
      version = await appApiClient.readVersion();
    } catch (error) {
      dispatchError(error);
    } finally {
      dialog.close();
    }

    if (version !== VERSION) {
      versionDialog.open({
        message: t('versionAvailable', { version }),
        action: VersionDialogAction.Download
      });
    } else {
      versionDialog.open({
        message: t('noNewUpdates', { version }),
        action: VersionDialogAction.None
      });
    }
  };

  const dispatchError = (error: unknown) => {
    dispatch({
      type: ActionType.SHOW_MESSAGE,
      messages: { error: handleError(error) }
    });
  };

  const cleanError = () => {
    dispatch({ type: ActionType.SHOW_MESSAGE, messages: { error: '' } });
  };

  const dispatchSuccessMessage = (message: string) => {
    dispatch({ type: ActionType.SHOW_MESSAGE, messages: { success: message } });
  };

  const cleanSuccessMessage = () => {
    dispatch({ type: ActionType.SHOW_MESSAGE, messages: { success: '' } });
  };

  const dispatchInfoMessage = (message: string) => {
    dispatch({ type: ActionType.SHOW_MESSAGE, messages: { info: message } });
  };

  const cleanInfoMessage = () => {
    dispatch({ type: ActionType.SHOW_MESSAGE, messages: { info: '' } });
  };

  const selectAppState = (state: RootState) => state.appState;
  const selectMessages = createSelector([selectAppState], (appState) => appState.messages);
  const selectError = createSelector([selectMessages], (messages) => messages.error);
  const selectSuccessMessage = createSelector([selectMessages], (messages) => messages.success);
  const selectInfoMessage = createSelector([selectMessages], (messages) => messages.info);

  return {
    dispatchError,
    cleanError,
    checkForUpdates,
    dispatchSuccessMessage,
    cleanSuccessMessage,
    dispatchInfoMessage,
    cleanInfoMessage,
    selectAppState,
    selectError,
    selectSuccessMessage,
    selectInfoMessage
  };
};
