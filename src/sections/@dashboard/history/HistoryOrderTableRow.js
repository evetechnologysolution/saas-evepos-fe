import PropTypes from "prop-types";
import { styled, TableRow, TableCell } from "@mui/material";
import Label from "../../../components/Label";
// utils
import { formatDate2, numberWithCommas } from "../../../utils/getData";

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    borderRadius: "8px",
  },
}));

export default function OrderTableRow({ row }) {

  const { date, paymentDate, orderId, orderType, status, billedAmount } = row;

  let statusColor;
  if (status?.toLowerCase() === "paid") {
    statusColor = "success";
  } else if (status?.toLowerCase() === "half paid") {
    statusColor = "secondary";
  } else if (status?.toLowerCase() === "pending") {
    statusColor = "warning";
  } else if (status?.toLowerCase() === "refund") {
    statusColor = "default";
  } else {
    statusColor = "error";
  }

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="center">{paymentDate ? formatDate2(paymentDate) : "-"}</TableCell>

      <TableCell align="left">{orderId}</TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={orderType === "onsite" ? "default" : "info"} sx={{ textTransform: "capitalize" }}>
          {orderType}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={statusColor} sx={{ textTransform: "capitalize" }}>
          {status === "pending" ? "unpaid" : status}
        </Label>
      </TableCell>

      <TableCell align="center">
        Rp. {numberWithCommas(billedAmount || 0)}
      </TableCell>

    </CustomTableRow>
  );
}
