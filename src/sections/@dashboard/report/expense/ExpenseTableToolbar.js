import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ExpenseTableToolbar.propTypes = {
    options: PropTypes.array,
    filterCode: PropTypes.number,
    onFilterCode: PropTypes.func,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onEnter: PropTypes.func,
};

export default function ExpenseTableToolbar({ options, filterCode, onFilterCode, filterName, onFilterName, onEnter }) {
    return (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
            <TextField
                fullWidth
                select
                label="Expense"
                value={filterCode}
                onChange={onFilterCode}
                SelectProps={{
                    MenuProps: {
                        sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                    },
                }}
                sx={{
                    maxWidth: { sm: 240 },
                    textTransform: 'capitalize',
                }}
            >
                {options.map((option, n) => (
                    <MenuItem
                        key={n}
                        value={option.code}
                        sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                        }}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                value={filterName}
                onChange={(e) => onFilterName(e.target.value)}
                onKeyDown={onEnter}
                placeholder="Search by detail..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
}
