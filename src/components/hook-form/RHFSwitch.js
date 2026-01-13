import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { styled, Switch, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
  name: PropTypes.string,
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    margin: 2,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    opacity: 1,
    boxSizing: 'border-box',
  },
}));

export default function RHFSwitch({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller name={name} control={control} render={({ field }) => <CustomSwitch {...field} checked={field.value} />} />
      }
      {...other}
    />
  );
}
