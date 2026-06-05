import { useMemo } from 'react';
import { Body1, H6, Icon, Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';
import { CardItem } from '@components/CardItem';
import { LifebuoyIcon } from '@heroicons/react/24/solid';
import { PAYPAL_BRONZE_PLAN_ID } from '@constants/constants';
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
        value: 7,
        rate: t('moneyRate'),
        colors: { primaryColor: '#da690d', secondaryColor: '#c85e07' }
      },
      {
        id: '',
        name: t('gold'),
        value: 14,
        rate: t('moneyRate'),
        colors: { primaryColor: '#dabf0d', secondaryColor: '#c8a507' }
      },
      {
        id: '',
        name: t('platinum'),
        value: 18,
        rate: t('moneyRate'),
        colors: { primaryColor: '#d4d2d1', secondaryColor: '#c1c8c7' }
      }
    ],
    []
  );

  return (
    <CardItem icon={LifebuoyIcon} label={t('donations')}>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        {PLANS.map(({ id, name, value, rate, colors }, index) => (
          <Stack
            onClick={() => {
              openExternal(`${PAYPAL_SUBSCRIBE_URL}?plan_id=${id}`);
            }}
            key={index}
            alignItems="center"
            style={{ cursor: 'pointer' }}
          >
            <Icon size={110} render={() => <WineIcon {...colors} />} />
            <Stack alignItems="center">
              <H6 fontWeight={500}>{name}</H6>
              <Body1 fontWeight={500}>
                {value} {rate}
              </Body1>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </CardItem>
  );
};
