import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  styled,
  TableRow,
  TableCell,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";

// ----------------------------------------------------------------------

BazaarLogTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="eva:close-fill" width={24} height={24} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function BazaarLogTableRow({ row }) {
  const theme = useTheme();

  const { createdAt, memberRef, standRef, voucherRef, isRedeem, point } = row;

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(createdAt)}</TableCell>

        <TableCell align="left">
          <Typography variant="body2">{memberRef?.name}</Typography>
          <Typography variant="caption" fontStyle="italic">{memberRef?.memberId}</Typography>
        </TableCell>

        <TableCell align="center">{isRedeem ? "Redeem Voucher" : "Scan QR Bazaar"}</TableCell>

        <TableCell align="left">
          {isRedeem ? (
            <Typography variant="body2">{voucherRef?.name}</Typography>
          ) : (
            <>
              <Typography variant="body2">{standRef?.name}</Typography>
              <Typography variant="caption" fontStyle="italic">{standRef?.standId}</Typography>
            </>
          )}
        </TableCell>


        <TableCell align="center">
          <Label
            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
            color={isRedeem ? "error" : "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {`${isRedeem ? "-" : "+"}${numberWithCommas(point)}`}
          </Label>
        </TableCell>

      </CustomTableRow>
    </>
  );
}

