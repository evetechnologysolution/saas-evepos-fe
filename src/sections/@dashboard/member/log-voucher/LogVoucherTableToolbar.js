import PropTypes from "prop-types";
import { Stack, InputAdornment, TextField } from "@mui/material";
// components
import Iconify from "../../../../components/Iconify";

// ----------------------------------------------------------------------

LogVoucherTableToolbar.propTypes = {
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onEnter: PropTypes.func,
};

export default function LogVoucherTableToolbar({ filterName, onFilterName, onEnter }) {
    return (
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ py: 2.5, px: 1 }}>
            <TextField
                fullWidth
                value={filterName}
                onChange={(event) => onFilterName(event.target.value)}
                onKeyDown={onEnter}
                placeholder="Search voucher..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon={"eva:search-fill"} sx={{ color: "text.disabled", width: 20, height: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
}
