import { CardItem } from '@components/CardItem';
import { LifebuoyIcon } from '@heroicons/react/24/solid';
import { PAYPAL_BRONZE_PLAN_ID } from '@constants/constants';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Body1, Box, H6, Icon, Stack } from 'reactjs-shared-ui';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useLoadingDialog } from '@hooks/useLoadingDialog';
import { withPaypalProvider } from '@hocs/withPaypalProvider';
import { WineIcon } from '@assets/icons/24/outline/WineIcon';

export const Donations: React.FC = withPaypalProvider(() => {
  const dialog = useLoadingDialog();
  const [loading, setLoading] = useState<boolean>();
  const PLANS = useMemo(
    () => [{ id: PAYPAL_BRONZE_PLAN_ID, name: 'Bronze', value: 7, rate: 'USD/month' }],
    []
  );

  useEffect(() => {
    if (loading === undefined) return;
    if (loading) {
      dialog.open({ message: 'Loading Paypal...' });
    } else {
      dialog.close();
    }
  }, [loading]);

  return (
    <CardItem icon={LifebuoyIcon} label={t('donations')}>
      <Stack spacing={2} display="block">
        {PLANS.map(({ id, name, value, rate }) => (
          <Stack
            direction="row"
            maxWidth={490}
            width="100%"
            sx={{ marginX: 'auto !important' }}
            justifyContent="space-between"
            alignItems="center"
            border={2}
            borderRadius={1}
            p={1}
            bgcolor="secondary.main"
            borderColor="secondary.light"
          >
            <Stack alignItems="center" direction="row">
              <Icon
                size={110}
                render={() => <WineIcon primaryColor="#da690d" secondaryColor="#c85e07" />}
              />
              <Stack alignItems="center">
                <H6 fontWeight={500}>{name}</H6>
                <Body1 fontWeight={500}>
                  {value} {rate}
                </Body1>
              </Stack>
            </Stack>
            <Box mt={1.5}>
              <PayPalButtons
                onClick={() => {
                  setLoading(true);
                }}
                onCancel={() => {
                  setLoading(false);
                }}
                onError={() => {
                  setLoading(false);
                }}
                createSubscription={(_, actions) => {
                  return actions.subscription.create({
                    plan_id: id
                  });
                }}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
    </CardItem>
  );
});
