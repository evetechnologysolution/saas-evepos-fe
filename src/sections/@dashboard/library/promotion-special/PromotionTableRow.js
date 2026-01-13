import React, { useState } from "react";
import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Button,
  Link,
  DialogTitle,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
// utils
import { formatOnlyDate, formatDate2, numberWithCommas } from "../../../../utils/getData";

// ----------------------------------------------------------------------

PromotionTableRow.propTypes = {
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
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

const dayOptions = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export default function PromotionTableRow({ row, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { date, name, products, type, selectedDay, startDate, endDate, isAvailable, amount, qtyMin, qtyFree } = row;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePromoType = (type) => {
    if (type === 1) {
      return `Discount ${amount}%`;
    }
    if (type === 2) {
      return `Package, Min. Qty ${qtyMin}, Free ${qtyFree}`;
    }
    return null;
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(date)}</TableCell>

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left">
          {products[0]?.name}

          {products?.length > 0 ? (
            <>
              <br />
              {products.length > 1 && (
                <Link component="button" variant="inherit" underline="hover" onClick={handleOpen}>
                  {`+${products?.length - 1} produk lainnya`}
                </Link>
              )}
            </>
          ) : (
            ""
          )}
        </TableCell>

        <TableCell align="left">{`${handlePromoType(type)}`}</TableCell>

        <TableCell align="center">{dayOptions[selectedDay] || "-"}</TableCell>

        <TableCell align="center">
          {endDate ? (
            `${formatOnlyDate(startDate)} - ${formatOnlyDate(endDate)}`
          ) : (
            `${formatOnlyDate(startDate)} - Selamanya`
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

      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        fullWidth
        maxWidth="xs"
        open={open}
        className="saved-modal"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ borderBottom: "1px solid #ccc" }}
        >
          Detail
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <table style={{ width: "100%" }}>
            <thead style={{ color: "#6c757d!important", fontSize: "0.9rem" }}>
              <tr>
                <th align="left">ITEMS</th>
                <th>QUANTITY</th>
                {type === 1 && <th align="right">PRICE</th>}

                <th> </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.85rem" }}>
              {type === 1 ? (
                products?.map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: "0.2rem 0" }}>{item.name}</td>
                    <td align="center">x 1</td>
                    <td align="right">Rp. {numberWithCommas(item.price - (item.price * (amount / 100)))}</td>
                  </tr>
                ))
              ) : (
                <>
                  {products?.map((item, i) => (
                    <tr key={i}>
                      <td style={{ padding: "0.2rem 0" }}>{item.name}</td>
                      <td align="center">x 1</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: "0.2rem 0", fontWeight: 600, marginTop: "10px" }}>TOTAL</td>
                    <td style={{ marginTop: "10px" }} align="center">
                      Min. Qty {qtyMin}, Free {qtyFree}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
