import { useState } from "react";
import { paramCase } from "change-case";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// @mui
import {
  styled,
  TableRow,
  TableCell,
  Link,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
// hooks
import useAuth from "../../../../hooks/useAuth";
// components
import Iconify from "../../../../components/Iconify";
import Label from "../../../../components/Label";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";
import { maskedPhone } from "../../../../utils/masked";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";

// ----------------------------------------------------------------------

OrdersTableRow.propTypes = {
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

export default function OrdersTableRow({ row }) {

  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    _id,
    orderId,
    bookingDate,
    date,
    customer,
    orders,
    status,
    // progressStatus,
    discountPrice,
    discountLabel,
    voucherDiscPrice,
    deliveryPrice,
    billedAmount,
  } = row;

  let statusColor;
  if (status?.toLowerCase() === "paid") {
    statusColor = "success";
  } else if (status?.toLowerCase() === "half paid") {
    statusColor = "secondary";
  } else if (status?.toLowerCase() === "pending") {
    statusColor = "warning";
  } else if (status?.toLowerCase() === "refund") {
    statusColor = "default";
  } else if (status?.toLowerCase() === "backlog") {
    statusColor = "default";
  } else {
    statusColor = "error";
  }

  // let progressColor;
  // if (progressStatus?.toLowerCase() === "selesai") {
  //   progressColor = "success";
  // } else if (progressStatus?.toLowerCase() === "sedang diantar") {
  //   progressColor = "info";
  // } else if (progressStatus?.toLowerCase() === "prosess packing") {
  //   progressColor = "primary";
  // } else if (progressStatus?.toLowerCase() === "prosess lipat") {
  //   progressColor = "primary";
  // } else if (progressStatus?.toLowerCase() === "prosess setrika") {
  //   progressColor = "primary";
  // } else if (progressStatus?.toLowerCase() === "prosess cuci") {
  //   progressColor = "primary";
  // } else if (progressStatus?.toLowerCase() === "menunggu penjemputan") {
  //   progressColor = "warning";
  // } else if (progressStatus?.toLowerCase() === "menunggu konfirmasi") {
  //   progressColor = "default";
  // } else if (progressStatus?.toLowerCase() === "awaiting pickup") {
  //   progressColor = "default";
  // } else if (progressStatus?.toLowerCase() === "dibatalkan") {
  //   progressColor = "error";
  // } else {
  //   progressColor = "default";
  // }

  const isBagDay = orders.find((row) => row.isLaundryBag);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">
          {formatDate2(bookingDate || date)}
        </TableCell>

        <TableCell>
          {isBagDay && (
            <>
              <Label variant="ghost" color="warning">
                Laundry Bag
              </Label>
              <br />
            </>
          )}
          {!orderId ? _id : orderId}
        </TableCell>

        <TableCell align="left">
          <p>{customer?.name || "-"}</p>
          {customer?.phone && (
            <p>
              {!customer?.phone?.includes("EM") ?
                maskedPhone(['owner', 'super admin']?.includes(user?.role), customer?.phone) || "-"
                : "-"
              }
            </p>
          )}
        </TableCell>

        <TableCell>
          {orders[0].qty === 0 && orders[0]?.category?.toLowerCase() === "kiloan"
            ? <span>{orders[0].name} <em style={{ color: "red" }}>{"(Belum ditimbang)"}</em></span>
            : `x ${orders[0].qty}${orders[0]?.category?.toLowerCase() === "kiloan" ? "kg" : ""} ${orders[0].name}`
          }
          {orders[0].variant.length > 0 && orders[0].variant.map((item, i) => (
            <span key={i}>
              <br />
              <em>{`${item.name} : ${item.option} ${item.qty > 1 ? `(x${item.qty})` : ""}`}</em>
            </span>
          ))}
          {orders[0].notes && (
            <span>
              <br />
              <em>Notes : {orders[0].notes}</em>
            </span>
          )}
          {orders[0].isLaundryBag && orders[0].discountLaundryBag && (
            <span>
              <br />
              <em>Laundry Bag Day</em>
            </span>
          )}
          {orders.length > 1 && (
            <>
              <br />
              <Link component="button" variant="inherit" underline="hover" onClick={handleOpen}>
                {`+${orders.length - 1} produk lainnya`}
              </Link>
            </>
          )}
        </TableCell>

        <TableCell align="center" sx={{ color: status?.toLowerCase() === "refund" ? "red" : "#212B36" }}>
          {deliveryPrice ? `Rp. ${numberWithCommas(deliveryPrice)}` : "-"}
        </TableCell>

        <TableCell align="center">
          {discountPrice > 0 || voucherDiscPrice > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", color: "red", opacity: 0.7 }}>
                Rp. {numberWithCommas(billedAmount + voucherDiscPrice + discountPrice)}
              </span>
              <br />
              Rp. {numberWithCommas(billedAmount)}
            </>
          ) : (
            <span style={{ color: status?.toLowerCase() === "refund" ? "red" : "#212B36" }}>
              Rp. {numberWithCommas(billedAmount)}
            </span>
          )}
          {discountLabel ? (
            <>
              <br />
              <span>{`(${discountLabel})`}</span>
            </>
          ) : null}
        </TableCell>

        <TableCell align="center">
          <Label variant="ghost" color={statusColor} sx={{ textTransform: "capitalize" }}>
            {status === "pending" ? "unpaid" : status}
          </Label>
        </TableCell>

        {/* <TableCell align="center">
          <Label variant="ghost" color={progressColor} sx={{ textTransform: "capitalize" }}>
            {progressStatus === "awaiting pickup" ? "menunggu konfirmasi" : progressStatus}
          </Label>
        </TableCell> */}

        <TableCell align="center">
          <Button
            title="Detail"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => navigate(PATH_DASHBOARD.cashier.deliveryEdit(paramCase(_id)))}
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
                <th align="left">ITEMS</th>
                <th>QUANTITY</th>
                <th align="right">PRICE</th>
                <th> </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.85rem" }}>
              {orders.map((item, i) => {
                let originPrice = item.price;
                if (item.isLaundryBag) {
                  originPrice += item.discountLaundryBag
                }
                return (
                  <tr key={i}>
                    <td style={{ padding: "0.2rem 0" }}>
                      {item.name}
                      {item.variant.length > 0 && item.variant.map((field, v) => (
                        <span key={v}>
                          <br />
                          <em>{`${field.name} : ${field.option} ${field.qty > 1 ? `(x${field.qty})` : ""}`}</em>
                        </span>
                      ))}
                      {item.notes && (
                        <span>
                          <br />
                          <em>Notes : {item.notes}</em>
                        </span>
                      )}
                      {item.isLaundryBag && item.discountLaundryBag && (
                        <span>
                          <br />
                          <em>Laundry Bag Day : {`(-Rp. ${numberWithCommas(Math.round(item.discountLaundryBag * item.qty))})`}</em>
                        </span>
                      )}
                    </td>
                    <td align="center">
                      {item.qty === 0 && item?.category?.toLowerCase() === "kiloan"
                        ? <em style={{ color: "red" }}>{"(Belum ditimbang)"}</em>
                        : `x ${item.qty}${item?.category?.toLowerCase() === "kiloan" ? "kg" : ""}`
                      }
                    </td>
                    <td align="right">
                      <span
                        style={{
                          color: item.promotionType === 1 || item.promotionType === 2 || item.isLaundryBag ? "red" : "#212B36",
                          textDecoration: item.promotionType === 1 || item.promotionType === 2 || item.isLaundryBag ? "line-through" : "none"
                        }}
                      >
                        Rp. {numberWithCommas(Math.round(item.qty * originPrice))}
                      </span>
                      {item.isLaundryBag && item.discountLaundryBag && (
                        <>
                          <br />
                          <span style={{ textDecoration: (item.promotionType === 1 && item.isLaundryBag) ? "line-through" : "none" }}>Rp. {numberWithCommas(Math.round(item.qty * item.price))}</span>
                          <br />
                        </>
                      )}
                      {item.promotionType === 1 && (
                        <>
                          <br />
                          <span>Rp. {numberWithCommas(Math.round(item.qty * item.price) - (Math.round(item.qty * item.price) * item.discountAmount) / 100)}</span>
                          <br />
                        </>
                      )}
                      {item.promotionType === 2 && (
                        <>
                          <br />
                          <span>Rp. {numberWithCommas(Math.round(item.qty * item.price) - Math.round(item.discountAmount))}</span>
                          <br />
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
