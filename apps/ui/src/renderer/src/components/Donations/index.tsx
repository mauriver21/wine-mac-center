import { useMemo } from 'react';
import { Body2, H6, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { CardItem } from '@components/CardItem';
import { LifebuoyIcon } from '@heroicons/react/24/solid';
import {
  PAYPAL_BRONZE_PLAN_ID,
  PAYPAL_GOLD_PLAN_ID,
  PAYPAL_PLATINUM_PLAN_ID
} from '@constants/constants';
import { WineIcon } from '@assets/icons/24/outline/WineIcon';
import { openExternal } from '@utils/openExternal';
import { PAYPAL_SUBSCRIBE_URL } from '@constants/urls';

export const Donations: React.FC = () => {
  const { t } = useI18n();
  const PLANS = useMemo(
    () => [
      {
        id: PAYPAL_BRONZE_PLAN_ID,
        name: t('bronze'),
        value: 2,
        rate: t('moneyRate'),
        colors: { primaryColor: '#da690d', secondaryColor: '#c85e07' }
      },
      {
        id: PAYPAL_GOLD_PLAN_ID,
        name: t('gold'),
        value: 5,
        rate: t('moneyRate'),
        colors: { primaryColor: '#dabf0d', secondaryColor: '#c8a507' }
      },
      {
        id: PAYPAL_PLATINUM_PLAN_ID,
        name: t('platinum'),
        value: 7,
        rate: t('moneyRate'),
        colors: { primaryColor: '#d4d2d1', secondaryColor: '#c1c8c7' }
      }
    ],
    []
  );

  return (
    <CardItem icon={LifebuoyIcon} label={t('donations')}>
      <Stack
        spacing={3}
        direction="row"
        justifyContent="space-between"
        sx={{ marginX: 'auto !important' }}
      >
        {PLANS.map(({ id, name, value, rate, colors }, index) => (
          <Stack
            onClick={() => {
              openExternal(`${PAYPAL_SUBSCRIBE_URL}?plan_id=${id}`);
            }}
            key={index}
            alignItems="center"
            style={{ cursor: 'pointer' }}
            border={(theme) => `1px solid ${theme.palette.primary.dark}`}
            borderRadius={3}
            p={1.5}
          >
            <Icon size={72} render={() => <WineIcon {...colors} />} />
            <Stack alignItems="center">
              <H6 fontWeight={500}>{name}</H6>
              <Body2 fontWeight={500} mt="-7px">
                {value} {rate}
              </Body2>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </CardItem>
  );
};
