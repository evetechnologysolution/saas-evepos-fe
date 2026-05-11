import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

RHFNumericFormat.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default function RHFNumericFormat({ name, label, helperText, min, max, ...other }) {
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
          isAllowed={(values) => {
            const { floatValue } = values;

            if (floatValue === undefined) return true;

            if (max !== undefined && floatValue > max) {
              return false;
            }

            if (min !== undefined && floatValue < min) {
              return false;
            }

            return true;
          }}
          onValueChange={(values) => {
            field.onChange(values.value === '' ? '' : Number(values.value));
          }}
          {...other}
        />
      )}
    />
  );
}
