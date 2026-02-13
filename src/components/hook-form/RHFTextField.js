import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export default function RHFTextField({ name, loading = false, ...other }) {
  const { control } = useFormContext();

  if (loading) {
    return <Skeleton variant="rectangular" sx={{ borderRadius: 1, minHeight: '56px', height: '100%' }} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
      )}
    />
  );
}
