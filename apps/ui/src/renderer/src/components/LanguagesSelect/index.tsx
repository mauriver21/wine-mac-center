import { useLocalState } from '@hooks/useLocalState';
import { Language } from '@interfaces/Language';
import { useEffect, useState } from 'react';
import { Select, SelectProps } from 'reactjs-shared-ui/forms';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface LanguagesSelectProps extends Omit<SelectProps, 'options' | 'onChange'> {
  onChange?: (language: Language) => void;
}

export const LanguagesSelect: React.FC<LanguagesSelectProps> = ({
  onChange: onChangeProp,
  value: valueProp,
  sx,
  ...rest
}) => {
  const { t, getLanguage, changeLanguage } = useI18n();
  const { setState, getState } = useLocalState('lang');
  const [value, setValue] = useState(getState()?.lang || getLanguage());

  const onChange: SelectProps['onChange'] = (event) => {
    const lang = (event.target as HTMLInputElement).value as Language;
    changeLanguage(lang);
    setState({ lang });
    onChangeProp?.(lang);
  };

  useEffect(() => {
    valueProp !== undefined && setValue(valueProp);
  }, [valueProp]);

  return (
    <Select
      {...rest}
      sx={{ minWidth: 160, ...sx }}
      value={value}
      options={[
        { label: t('en'), value: 'en' },
        { label: t('es'), value: 'es' }
      ]}
      onChange={onChange}
    />
  );
};
