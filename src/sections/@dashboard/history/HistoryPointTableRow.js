import PropTypes from "prop-types";
import { styled, TableRow, TableCell, Typography } from "@mui/material";
// utils
import { formatDate, formatDate2, numberWithCommas } from "../../../utils/getData";

// ----------------------------------------------------------------------

PointTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    borderRadius: "8px",
  },
}));

export default function PointTableRow({ row }) {

  const { date, pointExpiry, point, status, order } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="left">
        {status === "in" ? (
          `Transaksi ${order?.orderId} - ${numberWithCommas(order?.billedAmount || 0)}`
        ) : (
          "Voucher Redeem"
        )}
      </TableCell>

      <TableCell align="center">
        {status === "in" ? (
          <Typography variant="body2" color="green">+{point}</Typography>
        ) : (
          <Typography variant="body2" color="red">-{point}</Typography>
        )}
      </TableCell>

      <TableCell align="center">{status === "in" ? formatDate(pointExpiry) : "-"}</TableCell>

    </CustomTableRow>
  );
}
