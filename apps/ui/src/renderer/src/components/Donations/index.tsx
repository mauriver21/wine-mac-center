import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Version } from '@components/Version';
import { LifebuoyIcon } from '@heroicons/react/24/solid';
import { t } from 'i18next';
import { Card, CardContent, Stack, Icon, H6, ContentsClass, Body1 } from 'reactjs-shared-ui';
import { PAYPAL_BRONZE_PLAN_ID } from '@constants/constants';

export const Donations: React.FC = () => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        vault: true,
        intent: 'subscription'
      }}
    >
      <Card sx={{ padding: 0 }}>
        <CardContent sx={{ pb: '10px !important' }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" spacing={1}>
                <Icon strokeWidth={0} size={34} render={LifebuoyIcon} pr={1} />
                <H6 className={ContentsClass.ItemTitle}>{t('Version')}</H6>
              </Stack>
              <Body1>
                <Version />
              </Body1>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <PayPalButtons
                createSubscription={(_, actions) => {
                  return actions.subscription.create({
                    plan_id: PAYPAL_BRONZE_PLAN_ID
                  });
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </PayPalScriptProvider>
  );
};
