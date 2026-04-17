import { Controller, useFormContext } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

// =====================
// Day options (0–6)
// =====================
const DAY_OPTIONS = [
  // { label: 'Sunday', value: 0 },
  // { label: 'Monday', value: 1 },
  // { label: 'Tuesday', value: 2 },
  // { label: 'Wednesday', value: 3 },
  // { label: 'Thursday', value: 4 },
  // { label: 'Friday', value: 5 },
  // { label: 'Saturday', value: 6 },
  { label: 'Minggu', value: 0 },
  { label: 'Senin', value: 1 },
  { label: 'Selasa', value: 2 },
  { label: 'Rabu', value: 3 },
  { label: 'Kamis', value: 4 },
  { label: 'Jumat', value: 5 },
  { label: 'Sabtu', value: 6 },
];

export default function RHFDaySelect({
  name = 'selectedDay',
  label = 'Active Day',
  disabled = false,
  helperText,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          label={label}
          disabled={disabled}
          error={!!error}
          helperText={
            error?.message ||
            helperText ||
            'Select a specific day when this promotion is active. Leave empty to apply it every day.'
          }
          {...other}
        >
          <MenuItem value="">
            {/* <em>All Days</em> */}
            <em>Setiap Hari</em>
          </MenuItem>

          {DAY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
