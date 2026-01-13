import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

BazaarLogTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterStatus: PropTypes.string,
  optionsStatus: PropTypes.arrayOf(PropTypes.string),
  onFilterStatus: PropTypes.func,
  onFilterName: PropTypes.func,
  onEnter: PropTypes.func,
};

export default function BazaarLogTableToolbar({ filterName, onFilterName, filterStatus, optionsStatus, onFilterStatus, onEnter }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
      <TextField
        fullWidth
        select
        label="Status"
        value={filterStatus}
        onChange={onFilterStatus}
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
        {optionsStatus.map((option, i) => (
          <MenuItem
            key={i}
            value={option.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(e) => onFilterName(e.target.value)}
        onKeyDown={onEnter}
        placeholder="Search..."
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
