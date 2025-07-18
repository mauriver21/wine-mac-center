import { useEffect, useRef, useState } from 'react';
import { Body1, Box, Image, TextField } from 'reactjs-ui-core';
import { Field, TextFieldProps } from 'reactjs-ui-form-fields';
import { openFile } from '@utils/openFile';
import { FileFilter } from '@constants/enums';
import { getAppIcon as baseGetAppIcon } from '@utils/getAppIcon';
import defaultAppIcon from '@assets/imgs/header.jpg';

export type IconInputProps = Pick<TextFieldProps, 'control' | 'name' | 'fieldOptions'> & {
  dialogText?: string;
  onInput?: (file: File | undefined) => void;
  value?: string;
  appPath: string | undefined;
  refreshImage?: number;
};

export const IconInput: React.FC<IconInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value = '',
  dialogText = 'Select file',
  appPath,
  refreshImage,
  ...rest
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('');
  const [artWorkSrc, setIconSrc] = useState('');
  const [noIcon, setNoIcon] = useState(false);

  const getAppIcon = async () => {
    const appIcon = await baseGetAppIcon(appPath);
    setNoIcon(!appIcon);
    setIconSrc(appIcon || defaultAppIcon);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    value && setFileName(value);
  }, [value]);

  useEffect(() => {
    setIconSrc('');
    getAppIcon();
  }, [appPath, refreshImage]);

  return (
    <>
      <Box
        width={100}
        height={100}
        border={1}
        borderColor="primary.main"
        borderRadius={2}
        overflow="hidden"
        position="relative"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '& > .change-legend': { opacity: 0 },
          '& > .no-icon-legend': { opacity: 1 },
          '&:hover > .change-legend': { opacity: 0.8, background: 'black' },
          '&:hover > .no-icon-legend': { opacity: 0 }
        }}
      >
        <Box
          className="change-legend"
          position="absolute"
          top={0}
          left={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Body1 textAlign="center" p={1} fontWeight={500}>
            Change
          </Body1>
        </Box>
        <Image
          width="100%"
          height="100%"
          src={artWorkSrc}
          style={{
            objectFit: 'cover',
            maxWidth: '100%'
          }}
        />
        {noIcon ? (
          <Box
            className="no-icon-legend"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Body1 textAlign="center" p={1} fontWeight={500}>
              No Icon
            </Body1>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Field
        control={control}
        fieldOptions={fieldOptions}
        as="input"
        name={name}
        render={({ props: { onInput }, helpers }) => (
          <TextField
            fullWidth
            inputRef={inputRef}
            sx={{ display: 'none' }}
            {...rest}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true
            }}
            value={fileName}
            onClick={async () => {
              const { file, fileName } = await openFile(dialogText, { filters: FileFilter.Images });
              setFileName(fileName);
              onInput({ target: { value: file } });
              onInputProp?.(file);
            }}
            error={helpers.error}
            errorMessage={helpers.errorMessage}
          />
        )}
      />
    </>
  );
};
