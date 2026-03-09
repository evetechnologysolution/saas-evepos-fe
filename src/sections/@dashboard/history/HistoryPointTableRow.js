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

  const { createdAt, pointExpiry, point, status, orderRef } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell align="left">
        {status === "in" ? (
          `Transaksi ${orderRef?.orderId} - ${numberWithCommas(orderRef?.billedAmount || 0)}`
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
