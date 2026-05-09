import { useEffect, useRef, useState } from 'react';
import { Body1, Box, Image } from 'reactjs-shared-ui';
import { Field, TextField, TextFieldProps } from 'reactjs-shared-ui/forms';
import { openFile } from '@utils/openFile';
import { FileFilter } from '@constants/enums';
import { getAppLauncherImg as baseGetAppLauncherImg } from '@utils/getAppLauncherImg';
import defaultLauncherImg from '@assets/imgs/header.jpg';

export type LauncherImgInputProps = Pick<TextFieldProps, 'control' | 'name' | 'fieldOptions'> & {
  dialogText?: string;
  onInput?: (file: File | undefined) => void;
  value?: string;
  appName: string | undefined;
  refreshImage?: number;
} & ({ type: 'app'; appPath: string | undefined } | { type: 'image'; imgSrc: string | undefined });

export const LauncherImgInput: React.FC<LauncherImgInputProps> = ({
  onInput: onInputProp,
  control,
  fieldOptions,
  name,
  value = '',
  dialogText = 'Select file',
  appName = '',
  refreshImage,
  ...rest
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('');
  const [launcherImgSrc, setLauncherImgSrc] = useState('');
  const [noLauncherImg, setNoLauncherImg] = useState(false);

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
        return baseGetAppLauncherImg(rest.appPath);
      case 'image':
        return rest.imgSrc || '';
      default:
        return '';
    }
  };

  const getAppLauncherImg = async () => {
    const launcherImg = await getSrc();
    setNoLauncherImg(!launcherImg);
    setLauncherImgSrc(launcherImg || defaultLauncherImg);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    value && setFileName(value);
  }, [value]);

  useEffect(() => {
    setLauncherImgSrc('');
    getAppLauncherImg();
  }, [getSrcPath(), refreshImage]);

  return (
    <>
      <Box
        width={230}
        height={150}
        border={1}
        borderColor="primary.main"
        position="relative"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '& > .change-legend': { opacity: 0 },
          '& > .no-launcher-img-legend': { opacity: 1 },
          '&:hover > .change-legend': { opacity: 0.8, background: 'black' },
          '&:hover > .no-launcher-img-legend': { opacity: 0 }
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
            Change Launcher Image
          </Body1>
        </Box>
        <Image
          width="100%"
          height="100%"
          src={launcherImgSrc}
          style={{
            objectFit: 'cover',
            maxWidth: '100%'
          }}
        />
        {noLauncherImg ? (
          <Box
            className="no-launcher-img-legend"
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
              {appName}
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
