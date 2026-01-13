import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Stack, InputAdornment, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/Iconify";

const ScanVoucherTableToolbar = forwardRef(({ handleOpenCamera, filterName, onFilterName, onEnter, loading }, ref) => {
  return (
    <Stack spacing={2} direction={{ xs: "row", sm: "row" }} sx={{ py: 2.5, px: 1 }} alignItems="center">
      <TextField
        inputRef={ref} // Meneruskan ref ke TextField
        fullWidth
        autoFocus
        autoComplete="off"
        value={filterName}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= 13) {
            onFilterName(newValue);
          } else {
            onFilterName(newValue.slice(-13)); // Ambil 13 karakter terakhir (untuk replace otomatis)
          }
        }}
        onKeyDown={onEnter}
        placeholder="Masukkan Order ID..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={"eva:search-fill"} sx={{ color: "text.disabled", width: 20, height: 20 }} />
            </InputAdornment>
          ),
          inputProps: { maxLength: 13 } // Adjust the maximum input length as needed
        }}
      />
      <Stack display="flex" direction="row" alignItems="center" spacing={2} justifyContent="start">
        <LoadingButton variant="contained" onClick={handleOpenCamera} loading={loading}>
          <Iconify icon="solar:camera-bold" width={30} height={30} />
        </LoadingButton>
      </Stack>
    </Stack>
  );
});

ScanVoucherTableToolbar.propTypes = {
  handleOpenCamera: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onEnter: PropTypes.func,
  loading: PropTypes.bool,
};

export default ScanVoucherTableToolbar;