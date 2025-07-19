import { useEffect, useRef, useState } from 'react';
import { Body1, Box, Image, TextField } from 'reactjs-ui-core';
import { Field, TextFieldProps } from 'reactjs-ui-form-fields';
import { openFile } from '@utils/openFile';
import { FileFilter } from '@constants/enums';
import { getAppArtwork as baseGetAppArtwork } from '@utils/getAppArtwork';
import defaultArtwork from '@assets/imgs/header.jpg';

export type ArtWorkInputProps = Pick<TextFieldProps, 'control' | 'name' | 'fieldOptions'> & {
  dialogText?: string;
  onInput?: (file: File | undefined) => void;
  value?: string;
  realAppName: string | undefined;
  refreshImage?: number;
} & ({ type: 'app'; appPath: string | undefined } | { type: 'image'; imgSrc: string | undefined });

export const ArtWorkInput: React.FC<ArtWorkInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value = '',
  dialogText = 'Select file',
  realAppName = '',
  refreshImage,
  ...rest
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('');
  const [artWorkSrc, setArtWorkSrc] = useState('');
  const [noArtWork, setNoArtWork] = useState(false);

  const getSrcPath = () => {
    switch (rest.type) {
      case 'app':
        return rest.appPath || '';
      case 'image':
        return rest.imgSrc || '';
      default:
        return '';
    }
  };

  const getSrc = async () => {
    switch (rest.type) {
      case 'app':
        return baseGetAppArtwork(rest.appPath);
      case 'image':
        return rest.imgSrc || '';
      default:
        return '';
    }
  };

  const getAppArtwork = async () => {
    const artWork = await getSrc();
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
  }, [getSrcPath(), refreshImage]);

  return (
    <>
      <Box
        width={130}
        height={200}
        border={1}
        borderColor="primary.main"
        position="relative"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '& > .change-legend': { opacity: 0 },
          '& > .no-artwork-legend': { opacity: 1 },
          '&:hover > .change-legend': { opacity: 0.8, background: 'black' },
          '&:hover > .no-artwork-legend': { opacity: 0 }
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
            className="no-artwork-legend"
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
      <Box sx={{ display: 'none' }}>
        <Field
          control={control}
          fieldOptions={fieldOptions}
          as="input"
          name={name}
          render={({ props: { onInput }, helpers }) => (
            <TextField
              fullWidth
              inputRef={inputRef}
              {...rest}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true
              }}
              value={fileName}
              onClick={async (event) => {
                event.preventDefault();
                const { file, fileName } = await openFile(dialogText, {
                  filters: FileFilter.Images
                });
                setFileName(fileName);
                onInput({ target: { value: file } });
                onInputProp?.(file);
              }}
              error={helpers.error}
              errorMessage={helpers.errorMessage}
            />
          )}
        />
      </Box>
    </>
  );
};
