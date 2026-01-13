import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

MemberCardsToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onEnter: PropTypes.func,
};

export default function MemberCardsToolbar({ filterName, onFilterName, onEnter }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
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
        placeholder="Search..."
        // inputRef={(input) => input && input.focus()}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
          inputProps: { maxLength: 13 }, // Adjust the maximum input length as needed
        }}
      />
    </Stack>
  );
}
