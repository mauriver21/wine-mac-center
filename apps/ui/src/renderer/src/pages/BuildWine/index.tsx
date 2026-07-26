import { ConfigLayout } from '@layouts/ConfigLayout';
import { Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export const BuildWine: React.FC = () => {
  const { t } = useI18n();

  return (
    <ConfigLayout
      mainTitle={t('buildWine')}
      showBack={false}
      contentSlot={
        <Stack
          overflow="auto"
          spacing={1}
          sx={{
            overflowX: 'hidden !important'
          }}
          pb={2}
          alignItems="center"
        />
      }
    />
  );
};
