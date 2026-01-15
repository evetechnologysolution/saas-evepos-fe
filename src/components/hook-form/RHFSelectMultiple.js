import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Checkbox, ListItemText, Chip, Box } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelectMultiple.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default function RHFSelectMultiple({ name, children, placeholder = 'Pilih opsi', options = [], ...other }) {
  const { control, watch } = useFormContext();
  const selectedValues = watch(name) || [];

  const renderValue = (selected) => {
    if (selected.length === 0) {
      return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => {
          // Cari nama dari options atau children
          let label = value;

          if (options.length > 0) {
            const item = options.find((opt) => opt.value === value);
            label = item?.name || value;
          }

          return (
            <Chip
              key={value}
              label={label}
              size="small"
              sx={{
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message}
          SelectProps={{
            native: false,
            multiple: true,
            displayEmpty: true,
            renderValue,
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            },
          }}
          {...other}
        >
          {children ||
            options.map((option, index) => (
              <Box component="li" key={option.value || index}>
                <Checkbox checked={selectedValues.indexOf(option.value) > -1} size="small" />
                <ListItemText primary={option.name} />
              </Box>
            ))}
        </TextField>
      )}
    />
  );
}
