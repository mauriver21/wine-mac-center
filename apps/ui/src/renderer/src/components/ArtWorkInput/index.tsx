import { useEffect, useRef, useState } from 'react';
import { Body1, Box, Image, TextField } from 'reactjs-ui-core';
import { Field, TextFieldProps } from 'reactjs-ui-form-fields';
import { openFile } from '@utils/openFile';
import { FileFilter } from '@constants/enums';
import { getAppArtwork as baseGetAppArtwork } from '@utils/getAppArtwork';
import defaultArtwork from '@assets/imgs/header.jpg';

export type FileInputProps = Omit<
  TextFieldProps,
  'type' | 'label' | 'accept' | 'onInput' | 'value'
> & {
  noSelectedFileLabel?: string;
  selectedFileLabel?: string;
  dialogText?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  onInput?: (file: File | undefined) => void;
  value?: string;
  appPath: string | undefined;
  realAppName: string | undefined;
  refreshImage?: number;
};

export const ArtWorkInput: React.FC<FileInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value = '',
  noSelectedFileLabel,
  selectedFileLabel,
  dialogText = 'Select file',
  filters = FileFilter.Images,
  appPath,
  realAppName = '',
  refreshImage,
  ...rest
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('');
  const [artWorkSrc, setArtWorkSrc] = useState('');
  const [noArtWork, setNoArtWork] = useState(false);

  const getAppArtwork = async () => {
    const artWork = await baseGetAppArtwork(appPath);
    setNoArtWork(!artWork);
    setArtWorkSrc(artWork || defaultArtwork);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    value && setFileName(value);
  }, [value]);

  useEffect(() => {
    setArtWorkSrc('');
    getAppArtwork();
  }, [appPath, refreshImage]);

  return (
    <>
      <Box
        width={130}
        height={200}
        border={1}
        position="relative"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '& > div': { opacity: 0 },
          '&:hover > div': { opacity: 0.8, background: 'black' }
        }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Body1 textAlign="center" p={1} fontWeight={500} fontSize={12}>
            Change ArtWork
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
        {noArtWork ? (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Body1 textAlign="center" p={1} fontWeight={500} fontSize={12}>
              {realAppName}
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
              const { file, fileName } = await openFile(dialogText, { filters });
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
