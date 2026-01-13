import PropTypes from "prop-types";
import { styled, TableRow, TableCell, Link, Typography } from "@mui/material";
// hooks
import useAuth from "../../../../hooks/useAuth";
// components
import Label from "../../../../components/Label";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";
import { maskedPhone } from "../../../../utils/masked";

// ----------------------------------------------------------------------

MemberPointTableRow.propTypes = {
  row: PropTypes.object,
  onDetailRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

export default function MemberPointTableRow({ row, onDetailRow }) {
  const { user } = useAuth();

  const { date, latestOrder, memberId, name, phone, email, addresses, point } = row;

  // const mainAddress = Array.isArray(addresses) ? addresses?.find((item) => item?.isDefault) : null;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="center">
        <Link component="button" variant="inherit" underline="hover" onClick={onDetailRow}>
          {memberId}
        </Link>
      </TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{!phone?.includes("EM") ? maskedPhone(user.role === "Super Admin", phone) : "-"}</TableCell>

      <TableCell>{email}</TableCell>

      {/* <TableCell>{mainAddress?.address || "-"}</TableCell> */}

      <TableCell align="center">{latestOrder?.date ? formatDate2(latestOrder?.date) : "-"}</TableCell>

      <TableCell align="center">
        <Label
          variant="ghost"
          color="success"
        >
          <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(point || 0)}</Typography>
        </Label>
      </TableCell>

    </CustomTableRow>
  );
}
