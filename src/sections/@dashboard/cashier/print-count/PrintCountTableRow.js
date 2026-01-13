import { useState } from "react";
import PropTypes from "prop-types";
// @mui
import {
  styled,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
// components
import Iconify from "../../../../components/Iconify";
import Label from "../../../../components/Label";
// utils
import { formatDate2 } from "../../../../utils/getData";

// ----------------------------------------------------------------------

PrintCountTableRow.propTypes = {
  row: PropTypes.object,
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

export default function PrintCountTableRow({ row }) {

  const {
    orderId,
    date,
    customer,
    printCount,
    printLaundry,
    printHistory
  } = row;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">
          {formatDate2(date)}
        </TableCell>

        <TableCell>{orderId}</TableCell>

        <TableCell align="left">
          <p>{customer?.name}</p>
          {customer?.phone && (
            <p>{!customer?.phone.includes("EM") ? customer?.phone : "-"}</p>
          )}
        </TableCell>

        <TableCell align="center">
          {printCount}
        </TableCell>

        <TableCell align="center">
          {printLaundry}
        </TableCell>

        <TableCell align="center">
          <Button
            title="Detail"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            disabled={printHistory.length > 0 ? Boolean(false) : Boolean(true)}
            onClick={() => handleOpen()}
          >
            <Iconify icon="fluent:slide-search-32-regular" width={24} height={24} />
          </Button>
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
                <th>NO</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>STAFF</th>
                <th />
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.85rem" }}>
              {printHistory.map((item, i) => (
                <tr key={i}>
                  <td align="center">{i + 1}</td>
                  <td align="center" style={{ padding: "0.2rem 0" }}>
                    {formatDate2(item.date)}
                  </td>
                  <td align="center">
                    <Label
                      variant="ghost"
                      color={item.isLaundry ? "success" : "primary"}
                      sx={{ textTransform: "capitalize", width: "4rem" }}
                    >
                      {item.isLaundry ? "Laundry" : "Nota"}
                    </Label>
                  </td>
                  <td align="center">{item.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>

    </>
  );
}
