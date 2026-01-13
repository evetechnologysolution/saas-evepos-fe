import PropTypes from "prop-types";
import { styled, TableRow, TableCell } from "@mui/material";
import Label from "../../../components/Label";
// utils
import { formatDate, formatDate2 } from "../../../utils/getData";

// ----------------------------------------------------------------------

VoucherTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    borderRadius: "8px",
  },
}));

export default function VoucherTableRow({ row }) {

  const { date, expiry, voucherCode, name, isUsed } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">{voucherCode}</TableCell>

      <TableCell align="center">
        <Label
          variant="ghost"
          color={isUsed ? "success" : "warning"}
        >
          {isUsed ? "Used" : "Open"}
        </Label>
      </TableCell>

      <TableCell align="center">{formatDate(expiry)}</TableCell>

    </CustomTableRow>
  );
}
