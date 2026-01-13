import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Stack, InputAdornment, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/Iconify";

const ScanVoucherTableToolbar = forwardRef(({ filterName, onFilterName, onEnter, onSubmit, loading, children }, ref) => {
  return (
    <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ py: 2.5, px: 1 }} alignItems="center">
      <TextField
        inputRef={ref} // Meneruskan ref ke TextField
        fullWidth
        autoFocus
        autoComplete="off"
        value={filterName}
        // onChange={(event) => onFilterName(event.target.value)}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= 16) {
            onFilterName(newValue);
          } else {
            onFilterName(newValue.slice(-16)); // Ambil 16 karakter terakhir (untuk replace otomatis)
          }
        }}
        onKeyDown={onEnter}
        placeholder="Masukkan Kode Voucher..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={"eva:search-fill"} sx={{ color: "text.disabled", width: 20, height: 20 }} />
            </InputAdornment>
          ),
          inputProps: { maxLength: 16 } // Adjust the maximum input length as needed
        }}
      />
      <Stack display="flex" direction="row" alignItems="center" spacing={2} justifyContent="start">
        <LoadingButton variant="contained" color="primary" onClick={onSubmit} loading={loading}>
          <Iconify icon="eva:search-fill" width={30} height={30} />
        </LoadingButton>
        {children}
      </Stack>
    </Stack>
  );
});

ScanVoucherTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onEnter: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.element,
};

export default ScanVoucherTableToolbar;