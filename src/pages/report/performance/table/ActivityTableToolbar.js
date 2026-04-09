import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ActivityTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterPeriod: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterPeriod: PropTypes.func,
  onEnter: PropTypes.func,
  tempDate: PropTypes.object,
  setTempDate: PropTypes.func,
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
  setController: PropTypes.func,
};

export default function ActivityTableToolbar({ filterName, filterPeriod, onFilterName, onFilterPeriod, onEnter, tempDate, setTempDate, selectedDate, setSelectedDate, setController }) {
  const options = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
    { value: "date", label: "Custom Date" }
  ];

  return (
    <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ py: 2.5, px: 1 }}>
      <TextField
        fullWidth
        select
        label="Period"
        SelectProps={{
          MenuProps: {
            sx: { "& .MuiPaper-root": { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: "capitalize",
        }}
        value={filterPeriod}
        onChange={onFilterPeriod}
      >
        {options.map((item, i) => (
          <MenuItem
            key={i}
            value={item?.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: "body2",
              textTransform: "capitalize",
            }}
          >
            {item?.label}
          </MenuItem>
        ))}
      </TextField>

      {filterPeriod === "date" && (
        <>
          <Box minWidth={160}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Start Date"
                inputFormat="dd/MM/yyyy"
                value={tempDate?.start}
                onChange={(newValue) => {
                  setTempDate((prev) => ({ ...prev, start: newValue }));
                }}
                onAccept={(newValue) => {
                  setSelectedDate((prev) => ({ ...prev, start: newValue }));
                  if (newValue && selectedDate?.end) {
                    setController((prev) => ({
                      ...prev,
                      page: 0,
                      start: newValue,
                      end: selectedDate?.end,
                    }));
                  }
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
          </Box>
          <Box minWidth={160}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="End Date"
                inputFormat="dd/MM/yyyy"
                value={tempDate?.end}
                onChange={(newValue) => {
                  setTempDate((prev) => ({ ...prev, end: newValue }));
                }}
                onAccept={(newValue) => {
                  setSelectedDate((prev) => ({ ...prev, end: newValue }));
                  if (newValue && selectedDate?.start) {
                    setController((prev) => ({
                      ...prev,
                      page: 0,
                      start: selectedDate?.start,
                      end: newValue,
                    }));
                  }
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
          </Box>
        </>
      )}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        onKeyDown={onEnter}
        placeholder="Search Staff..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled", width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
