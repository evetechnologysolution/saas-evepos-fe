import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText, Skeleton } from '@mui/material';
// type
import { UploadAvatar, UploadMultiFile, UploadSingleFile } from '../upload';

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export function RHFUploadAvatar({ name, loading = false, ...other }) {
  const { control } = useFormContext();

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ borderRadius: 1, minHeight: '56px', height: '100%' }} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadSingleFile.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export function RHFUploadSingleFile({ name, loading = false, ...other }) {
  const { control } = useFormContext();

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ borderRadius: 1, minHeight: '56px', height: '100%' }} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <UploadSingleFile
            accept="image/*"
            file={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadMultiFile.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export function RHFUploadMultiFile({ name, loading = false, ...other }) {
  const { control } = useFormContext();

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ borderRadius: 1, minHeight: '56px', height: '100%' }} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
          <UploadMultiFile
            accept="image/*"
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
