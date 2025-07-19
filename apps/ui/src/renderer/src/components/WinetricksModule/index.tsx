import React from 'react';
import { WinetricksSelector } from '@components/WinetricksSelector';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Stack, Icon, H6, ContentsClass, Button, Body1 } from 'reactjs-ui-core';
import { useAppConfigContext } from '@hooks/useAppConfigContext';
import { useSchema, FormSchema } from './useSchema';
import { useForm } from 'reactjs-ui-form-fields';

export const WinetricksModule: React.FC = () => {
  const schema = useSchema();
  const form = useForm(schema);
  const { wineApp, loading, setLoading } = useAppConfigContext() || {};

  return (
    <Stack spacing={1}>
      <Stack direction="row" minWidth={210} pb={1}>
        <Icon strokeWidth={0} size={34} render={SparklesIcon} pr={1} />
        <H6 className={ContentsClass.ItemTitle}>Winetricks</H6>
      </Stack>
      <WinetricksSelector disabled={loading} name="winetricksVerbs" control={form.control} />
      <Stack width="100%" pt={1} alignItems="flex-end">
        <Button
          title={`Run Winetricks`}
          disabled={wineApp === undefined || loading}
          color="secondary"
          sx={{
            width: 90,
            height: 60,
            border: (theme) => `1px solid ${theme.palette.primary.main}`
          }}
          onClick={async () => {
            const verbs = (form.getValues() as FormSchema).winetricksVerbs || [];
            const verbsString = verbs.join(' ');
            setLoading?.(true);

            if (verbsString) {
              await wineApp?.winetrick(verbsString);
              form.reset();
              setLoading?.(false);
            } else {
              setLoading?.(false);
            }
          }}
        >
          <Body1>Run</Body1>
        </Button>
      </Stack>
    </Stack>
  );
};
