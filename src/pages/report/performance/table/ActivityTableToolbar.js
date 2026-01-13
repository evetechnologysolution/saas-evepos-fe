import PropTypes from "prop-types";
import { useState } from "react";
import { Stack, InputAdornment, TextField, MenuItem } from "@mui/material";
// components
import Iconify from "../../../../components/Iconify";

// ----------------------------------------------------------------------

ActivityTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterPeriod: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onFilterPeriod: PropTypes.func,
  onEnter: PropTypes.func
};

export default function ActivityTableToolbar({ filterName, filterPeriod, onFilterName, onFilterPeriod, onEnter }) {
  const options = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
    // { value: "by-date", label: "By Date" }
  ];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
