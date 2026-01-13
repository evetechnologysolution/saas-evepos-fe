import PropTypes from "prop-types";
import { styled, TableRow, TableCell } from "@mui/material";
import Label from "../../../components/Label";
// utils
import { formatDate, formatDate2 } from "../../../utils/getData";

// ----------------------------------------------------------------------

MemberTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

export default function MemberTableRow({ row }) {

  const { date, expiry, voucherCode, name, isUsed } = row;

  function isExpiredTime(expiry) {
    const expiryDate = new Date(expiry);

    // Cek date valid
    if (Number.isNaN(expiryDate.getTime())) {
      return true; // anggap expired jika invalid
    }

    return Date.now() > expiryDate.getTime();
  }

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">{voucherCode}</TableCell>

      <TableCell align="center">
        <Label
          variant="ghost"
          color={isUsed ? "success" : isExpiredTime(expiry) ? "error" : "warning"}
        >
          {isUsed ? "Used" : isExpiredTime(expiry) ? "Expired" : "Open"}
        </Label>
      </TableCell>

      <TableCell align="center">{formatDate(expiry)}</TableCell>

    </CustomTableRow>
  );
}
