import { AppExecutableSelectorItem } from '@components/AppExecutableSelectorItem';
import { Button } from '@components/Button';
import { WineAppExecutable } from '@interfaces/WineAppExecutable';
import { useEffect, useRef, useState } from 'react';
import { Stack } from 'reactjs-shared-ui';
import { useI18n } from 'reactjs-shared-ui/i18next';

export interface AppExecutablesSelectorProps {
  value?: WineAppExecutable[];
  onChange?: (executables: WineAppExecutable[]) => void;
  hideRunExeButton?: boolean;
}

export const DEFAULT_EXECUTABLE = { path: '', main: true, flags: '' } as const;
export const AppExecutablesSelector: React.FC<AppExecutablesSelectorProps> = ({
  value,
  onChange,
  hideRunExeButton
}) => {
  const { t } = useI18n();
  const ref = useRef({ mounted: false });
  const [executables, setExecutables] = useState<WineAppExecutable[]>([]);

  const insert = () => {
    let main = executables.length < 1;
    setExecutables((prev) => {
      const executables = [...(prev || []), { ...DEFAULT_EXECUTABLE, main }];
      return executables;
    });
  };

  const remove = (index: number) => {
    setExecutables((prev) => {
      let executables = prev?.filter((_, i) => index !== i);
      if (executables.length === 1) {
        executables = executables.map((item) => ({ ...item, main: true }));
      }
      return executables;
    });
  };

  const save = (data: Partial<WineAppExecutable> & { index: number }) => {
    const { index: dataIndex, ...restData } = data;
    setExecutables((prev) => {
      if (restData.main) {
        prev = prev.map((item) => ({ ...item, main: false }));
      }

      return prev.map((item, index) => {
        if (dataIndex === index) {
          return { ...item, ...restData };
        }

        return item;
      });
    });
  };

  useEffect(() => {
    value !== undefined && setExecutables(value);
  }, [value]);

  useEffect(() => {
    ref.current.mounted && onChange?.(executables);
  }, [executables]);

  useEffect(() => {
    ref.current.mounted = true;
  }, []);

  return (
    <Stack spacing={2}>
      {executables?.map((executable, index) => (
        <AppExecutableSelectorItem
          hideRemoveAction={executables.length <= 1}
          removeAction={remove}
          hideRunExeButton={hideRunExeButton}
          executable={executable}
          index={index}
          onChange={save}
        />
      ))}
      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={insert}>{t('addExecutable')}</Button>
      </Stack>
    </Stack>
  );
};
