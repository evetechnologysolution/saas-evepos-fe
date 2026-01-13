import React from "react";
import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Button,
  DialogTitle,
  IconButton,
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
// utils
import { formatOnlyDate, formatDate2, numberWithCommas } from "../../../../utils/getData";

// ----------------------------------------------------------------------

BazaarVoucherTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
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

export default function BazaarVoucherTableRow({ row, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { date, name, voucherType, start, end, isAvailable, worthPoint, isBazaar, isLimited, quota, quotaUsed, quotaValidated } = row;

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(date)}</TableCell>

        <TableCell align="left">
          <Stack>
            {name}
            {isBazaar && (
              <div>
                <Label variant="ghost" color="error">
                  Bazaar
                </Label>
              </div>
            )}
          </Stack>
        </TableCell>

        <TableCell align="left">{voucherType === 1 ? "Diskon" : voucherType === 2 ? "Hadiah" : "Pastcard"}</TableCell>

        <TableCell align="center">{numberWithCommas(worthPoint)}</TableCell>

        <TableCell align={isLimited ? "left" : "center"}>
          {/* {isLimited ? `Quota: ${numberWithCommas(quota)}, Redeemed: ${numberWithCommas(quotaUsed)}, Validated: ${numberWithCommas(quotaValidated)}` : "Unlimited"} */}
          {isLimited ?
            <>
              <p>Quota: {numberWithCommas(quota)}</p>
              <p>Redeemed: {numberWithCommas(quotaUsed)}</p>
              <p>Validated: {numberWithCommas(quotaValidated)}</p>
            </> : "Unlimited"}
        </TableCell>

        <TableCell align="center">
          {end ? (
            `${formatOnlyDate(start)} - ${formatOnlyDate(end)}`
          ) : (
            `${formatOnlyDate(start)} - Selamanya`
          )}
        </TableCell>

        <TableCell align="center">
          <Label
            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
            color={isAvailable ? "success" : "error"}
            sx={{ textTransform: "capitalize" }}
          >
            {isAvailable ? "Available" : "Not Available"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" justifyContent="center" gap={1}>
            <Button title="Edit" variant="contained" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
              onEditRow();
            }}>
              <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
            </Button>
            <Button title="Delete" variant="contained" color="error" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
              onDeleteRow();
            }}>
              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          </Stack>
        </TableCell>
      </CustomTableRow>
    </>
  );
}
