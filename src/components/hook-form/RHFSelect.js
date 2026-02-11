import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export default function RHFSelect({ name, loading = false, children, ...other }) {
  const { control } = useFormContext();

  if (loading) {
    return <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
