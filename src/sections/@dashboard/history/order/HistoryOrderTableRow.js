import PropTypes from "prop-types";
import { styled, TableRow, TableCell } from "@mui/material";
import Label from "../../../../components/Label";
// hooks
import useAuth from "../../../../hooks/useAuth";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";
import { maskedPhone } from "../../../../utils/masked";

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
  const { user } = useAuth();

  const { date, paymentDate, orderId, customer, firstOrder, status, billedAmount } = row;

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

      <TableCell align="left">
        <p>{customer?.name || "-"}</p>
        {customer?.phone && (
          <p>
            {!customer?.phone?.includes("EM") ?
              maskedPhone(user?.role === "Super Admin", customer?.phone) || "-"
              : "-"
            }
          </p>
        )}
      </TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={firstOrder ? "success" : "warning"} sx={{ textTransform: "capitalize" }}>
          {firstOrder ? "Baru" : "Lama"}
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
