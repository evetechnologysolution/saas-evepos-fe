import PropTypes from 'prop-types';
import { Button, Grid, Stack, InputAdornment, TextField } from '@mui/material';
// hooks
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

CashCashierTableToolbar.propTypes = {
  filterStartDate: PropTypes.any,
  onFilterStartDate: PropTypes.func,
  filterEndDate: PropTypes.any,
  onFilterEndDate: PropTypes.func,
  handleReset: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default function CashCashierTableToolbar({ filterStartDate, onFilterStartDate, filterEndDate, onFilterEndDate, handleReset, handleSubmit }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs="auto">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="Start Date"
              inputFormat="dd/MM/yyyy"
              value={filterStartDate}
              onChange={(newValue) => {
                onFilterStartDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src="/assets/calender-icon.svg" alt="icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs="auto">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="End Date"
              inputFormat="dd/MM/yyyy"
              value={filterEndDate}
              onChange={(newValue) => {
                onFilterEndDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src="/assets/calender-icon.svg" alt="icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs="auto">
          <Button variant="contained" color="warning" title="Reset" sx={{ color: "white" }} onClick={() => handleReset()}>
            {/* Reset */}
            <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
          </Button>
          <Button variant="contained" title="Search" sx={{ ml: 1 }} onClick={() => handleSubmit()}>
            {/* Search */}
            <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
