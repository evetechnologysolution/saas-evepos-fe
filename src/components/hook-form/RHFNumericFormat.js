import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

RHFNumericFormat.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFNumericFormat({ name, label, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <NumericFormat
          value={field.value ?? ''}
          customInput={TextField}
          fullWidth
          label={label}
          error={!!error}
          helperText={error ? error.message : helperText}
          onValueChange={(values) => {
            field.onChange(values.value === '' ? '' : Number(values.value));
          }}
          {...other}
        />
      )}
    />
  );
}
