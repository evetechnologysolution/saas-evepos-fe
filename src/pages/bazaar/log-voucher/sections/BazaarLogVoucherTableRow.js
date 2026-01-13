import PropTypes from "prop-types";
import { styled, TableRow, TableCell } from "@mui/material";
// hooks
import useAuth from "../../../../hooks/useAuth";
// utils
import { formatDate2 } from "../../../../utils/getData";
import { maskedPhone } from "../../../../utils/masked";

// ----------------------------------------------------------------------

BazaarLogVoucherTableRow.propTypes = {
  row: PropTypes.object
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

export default function BazaarLogVoucherTableRow({ row }) {
  const { user } = useAuth();

  const { usedAt, name, voucherCode, voucherType, member } = row;
  const allowedRoles = ["Super Admin", "Admin Bazaar", "Staff Bazaar"];

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(usedAt)}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{voucherCode}</TableCell>

      <TableCell>{voucherType === 1 ? "Diskon" : voucherType === 2 ? "Hadiah" : "Pastcard"}</TableCell>

      <TableCell>{member.memberId}</TableCell>

      <TableCell>{member.name}</TableCell>

      <TableCell>{!member?.phone?.includes("EM") ? maskedPhone(allowedRoles.includes(user.role), member?.phone) : "-"}</TableCell>

    </CustomTableRow>
  );
}
