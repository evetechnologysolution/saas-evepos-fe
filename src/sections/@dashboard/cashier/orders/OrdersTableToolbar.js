import PropTypes from 'prop-types';
import { Box, Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

OrdersTableToolbar.propTypes = {
    options: PropTypes.array,
    filterStatus: PropTypes.string,
    handleFilterStatus: PropTypes.func,
    startDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.oneOf([null]),
    ]),
    setStartDate: PropTypes.func,
    endDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.oneOf([null]),
    ]),
    setEndDate: PropTypes.func,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onEnter: PropTypes.func,
};

export default function OrdersTableToolbar({ options, filterStatus, handleFilterStatus, startDate, setStartDate, endDate, setEndDate, filterName, onFilterName, onEnter }) {
    return (
        <Stack gap={2} direction={{ xs: 'column', sm: 'row' }}>
            <TextField
                name="status"
                label="Status"
                placeholder="Status"
                select
                sx={{ minWidth: 110 }}
                value={filterStatus}
                onChange={(e) => {
                    handleFilterStatus(e.target.value)
                }}
            >
                {options.map((item, i) => (
                    <MenuItem key={i} value={item}>{item}</MenuItem>
                ))}
            </TextField>
            <Box minWidth={160}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                        label="Start Date"
                        inputFormat="dd/MM/yyyy"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
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
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
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
            <TextField
                fullWidth
                value={filterName}
                // onChange={(e) => onFilterName(e.target.value)}
                onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length <= 13) {
                        onFilterName(newValue);
                    } else {
                        onFilterName(newValue.slice(-13)); // Ambil 13 karakter terakhir (untuk replace otomatis)
                    }
                }}
                onKeyDown={onEnter}
                placeholder="Search Order..."
                // inputRef={(input) => input && input.focus()}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                    ),
                    inputProps: { maxLength: 13 } // Adjust the maximum input length as needed
                }}
            />
        </Stack >
    );
}
