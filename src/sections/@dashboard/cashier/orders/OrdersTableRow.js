/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
// react-to-print
import { useReactToPrint } from 'react-to-print';
// @mui
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Link,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import ConfirmCancelOrder from '../../../../components/ConfirmCancelOrder';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { TableMoreMenu } from '../../../../components/table';
import ModalRefund from './ModalRefund';
import ModalChangePayment from './ModalChangePayment';
// utils
import { formatDate, formatDate2, numberWithCommas } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// print order
import PrintReceipt from '../pos/PrintReceiptFromOrders';
// import PrintLaundry from "../pos/PrintLaundryFromOrders";
import ModalPrintLaundry from './ModalPrintLaundry';

// ----------------------------------------------------------------------

OrdersTableRow.propTypes = {
  row: PropTypes.object,
  local: PropTypes.bool,
  closeLocal: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
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
            position: 'absolute',
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

export default function OrdersTableRow({ row, local, closeLocal, onDeleteRow }) {
  const ctx = useContext(cashierContext);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const client = useQueryClient();

  const {
    _id,
    orderId,
    createdAt,
    date,
    // staff,
    customer,
    customerRef,
    orders,
    orderType,
    status,
    dp,
    serviceCharge,
    serviceChargePercentage,
    tax,
    taxPercentage,
    discount,
    discountPrice,
    discountLabel,
    voucherCode,
    voucherDiscPrice,
    deliveryPrice,
    havePaid,
    billedAmount,
    payment,
    cardBankName,
    cardAccountName,
    cardNumber,
    isScan,
  } = row;

  let statusColor;
  if (status?.toLowerCase() === 'paid') {
    statusColor = 'success';
  } else if (status?.toLowerCase() === 'half paid') {
    statusColor = 'secondary';
  } else if (status?.toLowerCase() === 'unpaid') {
    statusColor = 'warning';
  } else if (status?.toLowerCase() === 'refund') {
    statusColor = 'default';
  } else {
    statusColor = 'error';
  }

  const isBagDay = orders.find((row) => row.isLaundryBag);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const handleCloseRefund = () => setOpenRefund(false);
  const [openPayment, setOpenPayment] = useState(false);

  const [loadingShow, setLoadingShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openCancelPayment, setOpenCancelPayment] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  const [openPrintLaundry, setOpenPrintLaundry] = useState(false);

  // Print
  const printRef = useRef();
  const handleAfterPrint = () => {
    ctx.updatePrintCount(_id, { staff: user?.fullname });
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: handleAfterPrint,
  });

  // Print Laundry
  // const printLaundryRef = useRef();
  // const handleAfterPrintLaundry = () => {
  //   ctx.updatePrintLaundry(_id, { staff: user?.fullname });
  // };
  // const handlePrintLaundry = useReactToPrint({
  //   content: () => printLaundryRef.current,
  //   onAfterPrint: handleAfterPrintLaundry,
  // });

  const showOrderType = () => {
    if (orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

  const sendInvoice = (data) => {
    if (!data || !data.customer || !data.orders || data.orders.length === 0) {
      console.error('Data tidak valid');
      return;
    }

    const { customer, orders, orderId, billedAmount, status, discountPrice, voucherDiscPrice } = data;
    const phone = customer.phone.startsWith('08') ? `62${customer.phone.slice(1)}` : customer.phone;

    const items = orders
      .map((order) => {
        const discountPerItem = order.discountAmount > 0 ? (order.price * order.discountAmount) / 100 : 0;
        const priceAfterDiscount = order.price - discountPerItem;
        const totalPrice = Math.round(order.qty * priceAfterDiscount);

        return `- ${order.name} x${
          order.qty
        } @ Rp${priceAfterDiscount.toLocaleString()} = Rp${totalPrice.toLocaleString()}`;
      })
      .join('\n');

    const totalDisc =
      discountPrice || voucherDiscPrice ? `💸 *Diskon:* Rp${(discountPrice + voucherDiscPrice).toLocaleString()}` : '';
    const totalDelivery = deliveryPrice ? `🛵 *Ongkir:* Rp${deliveryPrice.toLocaleString()}` : '';
    // Gabungkan hanya jika ada nilainya
    const additionalDetails = [totalDisc, totalDelivery].filter(Boolean).join('\n');

    const bodyMsg = `Halo ${customer.name},
Laundry Anda sudah selesai diproses.

📌 *Detail Pesanan*
📅 Order ID: ${orderId}

🛒 *Pesanan Anda:*
${items}

${additionalDetails}
💰 *Total Tagihan:* Rp${billedAmount.toLocaleString()}
💵 *Status Tagihan:* ${status === 'paid' ? 'Lunas' : 'Belum Lunas'}
    
Jika ada pertanyaan atau kendala, silakan hubungi kami.
Terima kasih telah menggunakan layanan kami 🙏`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(bodyMsg)}`;
    window.open(url, '_blank');
  };

  const handlePay = async () => {
    setLoadingShow(true);

    ctx.handleResetPos();
    ctx.setCurrentOrderID(_id);
    ctx.setDisplayOrderID(orderId);
    ctx.setBill(orders);
    ctx.setOrderDate(createdAt || date);
    if (customer.name) {
      ctx.setCustomerData(customer);
      ctx.setCustomerName(customer.name);
      ctx.setCustomerPhone(customer?.phone || '');
      ctx.setCustomerNotes(customer?.notes || '');
      ctx.setCustomerPoint(customerRef?.point || 0);
      ctx.setCustomerScan(isScan || false);
    }
    ctx.setOrderType(showOrderType());
    if (dp) {
      ctx.setDp(dp);
    }
    if (serviceCharge) {
      ctx.setServiceCharge(serviceCharge);
      ctx.setServiceChargePercentage(serviceChargePercentage);
    }
    if (tax) {
      ctx.setTax(tax);
      ctx.setTaxPercentage(taxPercentage);
    }
    if (discount) {
      ctx.setDiscount(discount);
    }
    if (discountPrice) {
      ctx.setDiscountPrice(discountPrice);
    }
    if (discountLabel) {
      ctx.setDiscountLabel(discountLabel);
    }
    if (voucherCode) {
      ctx.setVoucherCode(voucherCode?.[0] || '');
    }
    if (voucherDiscPrice) {
      ctx.setVoucherDiscPrice(voucherDiscPrice);
    }
    if (deliveryPrice) {
      ctx.setDeliveryPrice(deliveryPrice);
    }
    if (havePaid) {
      ctx.setHavePaid(havePaid);
    }

    setTimeout(() => {
      if (local) {
        closeLocal();
      } else {
        navigate(PATH_DASHBOARD.cashier.pos);
      }
      setLoadingShow(false);
    }, 100);
  };

  const handleCancelOrder = async () => {
    setIsLoading(true);
    await axios.patch(`/order/raw/${_id}`, { status: 'cancel' });
    client.invalidateQueries('orders');
    setOpenCancel(false);
    setIsLoading(false);
    enqueueSnackbar(`Cancel Order ${orderId || _id} success!`);
  };

  const handleGeneratePoint = async () => {
    setIsLoading(true);
    await axios.patch(`/order/generate-point/${_id}`);
    client.invalidateQueries('orders');
    setOpenGenerate(false);
    setIsLoading(false);
    enqueueSnackbar(`Generate Point ${orderId || _id} success!`);
  };

  const handleCancelPayment = async () => {
    setIsLoading(true);
    const updated = {
      paymentDate: null,
      havePaid: 0,
      status: 'unpaid',
      payment: '',
      cardBankName: '',
      cardAccountName: '',
      cardNumber: '',
    };
    await axios.patch(`/order/raw/${_id}`, updated);
    client.invalidateQueries('orders');
    setOpenCancelPayment(false);
    setIsLoading(false);
    enqueueSnackbar(`Cancel payment for Order ${orderId || _id} success!`);
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(createdAt || date)}</TableCell>

        {!local && (
          <TableCell>
            <Stack flexDirection="row" gap={1}>
              <Label variant="ghost" color={showOrderType() === 'Onsite' ? 'default' : 'info'}>
                {showOrderType()}
              </Label>
              {isBagDay && (
                <Label variant="ghost" color="warning">
                  Laundry Bag
                </Label>
              )}
            </Stack>
            {user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner' ? (
              <Link
                component="button"
                variant="subtitle2"
                underline="hover"
                onClick={() => navigate(PATH_DASHBOARD.cashier.ordersEdit(paramCase(_id)))}
              >
                {!orderId ? _id : orderId}
              </Link>
            ) : !orderId ? (
              _id
            ) : (
              orderId
            )}
          </TableCell>
        )}

        <TableCell align="left">
          <p>{customer?.name || '-'}</p>
          {customer?.phone && (
            <p>
              {!customer?.phone?.includes('EM')
                ? maskedPhone(user?.role === 'Super Admin', customer?.phone) || '-'
                : '-'}
            </p>
          )}
          <Label variant="ghost" color={isScan ? 'info' : 'default'}>
            {isScan ? 'Scan' : 'Tidak Scan'}
          </Label>
        </TableCell>

        {!local && (
          <>
            <TableCell>
              {orders.length > 0 ? (
                <>
                  {orders[0].qty === 0 && orders[0]?.category?.toLowerCase() === 'kiloan' ? (
                    <span>
                      {orders[0].name} <em style={{ color: 'red' }}>{'(Belum ditimbang)'}</em>
                    </span>
                  ) : (
                    `x ${orders[0].qty}${orders[0]?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''} ${orders[0].name}`
                  )}
                  {orders[0].variant.length > 0 &&
                    orders[0].variant.map((item, i) => (
                      <span key={i}>
                        <br />
                        <em>{`${item?.name} : ${item?.option} ${item?.qty > 1 ? `(x${item?.qty})` : ''}`}</em>
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
                </>
              ) : (
                <Label variant="ghost" color="error" sx={{ textTransform: 'capitalize' }}>
                  Belum Input Product
                </Label>
              )}
            </TableCell>

            <TableCell align="center">
              <Label variant="ghost" color={statusColor} sx={{ textTransform: 'capitalize' }}>
                {status === 'unpaid' ? 'unpaid' : status}
              </Label>
            </TableCell>
          </>
        )}

        <TableCell align="center" sx={{ color: status?.toLowerCase() === 'refund' ? 'red' : '#212B36' }}>
          {deliveryPrice ? `Rp. ${numberWithCommas(deliveryPrice)}` : '-'}
        </TableCell>

        <TableCell align="center">
          {discountPrice > 0 || voucherDiscPrice > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'red', opacity: 0.7 }}>
                Rp. {numberWithCommas(billedAmount + voucherDiscPrice + discountPrice)}
              </span>
              <br />
              Rp. {numberWithCommas(billedAmount)}
            </>
          ) : (
            <span style={{ color: status?.toLowerCase() === 'refund' ? 'red' : '#212B36' }}>
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

        {/* {!local && (
          <TableCell align="center" sx={{ color: status?.toLowerCase() === "refund" ? "red" : "#212B36" }}>
            {havePaid ? `Rp. ${numberWithCommas(havePaid)}` : "-"}
          </TableCell>
        )} */}

        <TableCell align="center">
          {status?.toLowerCase() === 'paid' ||
          status?.toLowerCase() === 'refund' ||
          status?.toLowerCase() === 'cancel' ? (
            <div>
              {/* {user?.role === "Super Admin" ? (
                <Link component="button" variant="body2" underline="hover" onClick={() => setOpenPayment(true)}>
                  {payment}
                </Link>
              ) : (
                payment
              )} */}
              {payment}
              {payment === 'Card' && (
                <div style={{ fontSize: '13px' }}>
                  {cardBankName}
                  <br />
                  {cardAccountName}
                  <br />
                  {cardNumber}
                </div>
              )}
            </div>
          ) : (
            <LoadingButton type="button" variant="contained" loading={loadingShow} onClick={() => handlePay()}>
              Show
            </LoadingButton>
          )}
        </TableCell>

        {!local && (
          <TableCell align="center">
            {/* <Button type="button" variant="contained" title="Print Laundry" onClick={() => handlePrintLaundry()}> */}
            <Button type="button" variant="contained" title="Print Laundry" onClick={() => setOpenPrintLaundry(true)}>
              <Iconify icon="solar:printer-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          </TableCell>
        )}

        {!local && (
          <TableCell align="center">
            <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
              <PrintReceipt ref={printRef} data={row} />
              {/* <PrintLaundry ref={printLaundryRef} data={row} /> */}
            </div>
            <TableMoreMenu
              open={openAction}
              onOpen={handleOpenAction}
              onClose={handleCloseAction}
              actions={
                <>
                  {['admin', 'cashier', 'staff', 'owner'].includes(user?.role?.toLowerCase()) && (
                    <MenuItem
                      disabled={
                        status?.toLowerCase() === 'paid' || status?.toLowerCase() === 'unpaid'
                          ? Boolean(false)
                          : Boolean(true)
                      }
                      onClick={() => {
                        sendInvoice(row);
                        handleCloseAction();
                      }}
                    >
                      <Iconify icon="fa6-brands:whatsapp" sx={{ width: 24, height: 24 }} />
                      Send Invoice
                    </MenuItem>
                  )}
                  <MenuItem
                    disabled={
                      status?.toLowerCase() === 'paid' || status?.toLowerCase() === 'unpaid'
                        ? Boolean(false)
                        : Boolean(true)
                    }
                    onClick={() => {
                      handlePrint();
                      handleCloseAction();
                    }}
                  >
                    <Iconify icon="solar:printer-outline" sx={{ width: 24, height: 24 }} />
                    Print Nota
                  </MenuItem>
                  {/* {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && (
                    <MenuItem
                      disabled={status?.toLowerCase() === 'paid' && isScan !== true ? Boolean(false) : Boolean(true)}
                      onClick={() => {
                        setOpenGenerate(true);
                        handleCloseAction();
                      }}
                    >
                      <Iconify icon="bi:coin" sx={{ width: 24, height: 24 }} />
                      Generate Point
                    </MenuItem>
                  )} */}
                  <MenuItem
                    disabled={
                      status?.toLowerCase() === 'paid' && formatDate(createdAt || date) === formatDate(new Date())
                        ? Boolean(false)
                        : Boolean(true)
                    }
                    onClick={() => {
                      setOpenRefund(true);
                      handleCloseAction();
                    }}
                  >
                    <Iconify icon="material-symbols:currency-exchange-rounded" sx={{ width: 24, height: 24 }} />
                    Refund
                  </MenuItem>
                  {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && (
                    <MenuItem
                      sx={{ color: 'red' }}
                      disabled={
                        status?.toLowerCase() === 'unpaid' || status?.toLowerCase() === 'cancel'
                          ? Boolean(true)
                          : Boolean(false)
                      }
                      onClick={() => {
                        setOpenCancelPayment(true);
                        handleCloseAction();
                      }}
                    >
                      <Iconify icon="fluent:money-dismiss-24-regular" sx={{ width: 24, height: 24 }} />
                      Set Unpaid
                    </MenuItem>
                  )}
                  <MenuItem
                    sx={{ color: 'red' }}
                    disabled={status?.toLowerCase() === 'cancel'}
                    onClick={() => {
                      setOpenCancel(true);
                      handleCloseAction();
                    }}
                  >
                    <Iconify icon="fluent:calendar-cancel-24-regular" sx={{ width: 24, height: 24 }} />
                    Cancel Order
                  </MenuItem>
                  {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && (
                    <MenuItem
                      sx={{ color: 'red' }}
                      onClick={() => {
                        onDeleteRow();
                        handleCloseAction();
                      }}
                    >
                      <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                      Delete Order
                    </MenuItem>
                  )}
                </>
              }
            />
          </TableCell>
        )}
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
          style={{ borderBottom: '1px solid #CCCCCC' }}
        >
          Detail
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <table style={{ width: '100%' }}>
            <thead style={{ color: '#6c757d!important', fontSize: '0.9rem' }}>
              <tr>
                <th align="left">ITEMS</th>
                <th>QUANTITY</th>
                <th align="right">PRICE</th>
                <th> </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {orders?.map((item, i) => {
                let originPrice = item?.price;
                if (item?.isLaundryBag) {
                  originPrice += item?.discountLaundryBag;
                }
                return (
                  <tr key={i}>
                    <td style={{ padding: '0.2rem 0' }}>
                      {item?.name}
                      {item?.variant?.length > 0 &&
                        item?.variant?.map((field, v) => (
                          <span key={v}>
                            <br />
                            <em>{`${field?.name} : ${field?.option} ${field?.qty > 1 ? `(x${field?.qty})` : ''}`}</em>
                          </span>
                        ))}
                      {item?.notes && (
                        <span>
                          <br />
                          <em>Notes : {item?.notes}</em>
                        </span>
                      )}
                      {item?.isLaundryBag && item?.discountLaundryBag && (
                        <span>
                          <br />
                          <em>
                            Laundry Bag Day :{' '}
                            {`(-Rp. ${numberWithCommas(Math.round(item?.discountLaundryBag * item?.qty))})`}
                          </em>
                        </span>
                      )}
                    </td>
                    <td align="center">
                      {item?.qty === 0 && item?.category?.toLowerCase() === 'kiloan' ? (
                        <em style={{ color: 'red' }}>{'(Belum ditimbang)'}</em>
                      ) : (
                        `x ${item?.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''}`
                      )}
                    </td>
                    <td align="right">
                      <span
                        style={{
                          color:
                            item?.promotionType === 1 || item?.promotionType === 2 || item?.isLaundryBag
                              ? 'red'
                              : '#212B36',
                          textDecoration:
                            item?.promotionType === 1 || item?.promotionType === 2 || item?.isLaundryBag
                              ? 'line-through'
                              : 'none',
                        }}
                      >
                        Rp. {numberWithCommas(Math.round(item?.qty * originPrice))}
                      </span>
                      {item?.isLaundryBag && item?.discountLaundryBag && (
                        <>
                          <br />
                          <span
                            style={{
                              textDecoration: item?.promotionType === 1 && item?.isLaundryBag ? 'line-through' : 'none',
                            }}
                          >
                            Rp. {numberWithCommas(Math.round(item?.qty * item?.price))}
                          </span>
                          <br />
                        </>
                      )}
                      {item?.promotionType === 1 && (
                        <>
                          <br />
                          <span>
                            Rp.{' '}
                            {numberWithCommas(
                              Math.round(item?.qty * item?.price) -
                                (Math.round(item?.qty * item?.price) * item?.discountAmount) / 100
                            )}
                          </span>
                          <br />
                        </>
                      )}
                      {item?.promotionType === 2 && (
                        <>
                          <br />
                          <span>
                            Rp.{' '}
                            {numberWithCommas(Math.round(item?.qty * item?.price) - Math.round(item?.discountAmount))}
                          </span>
                          <br />
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>

      <ModalRefund open={openRefund} onClose={handleCloseRefund} data={row} />

      <ModalChangePayment open={openPayment} onClose={() => setOpenPayment(false)} data={row} />

      <ModalPrintLaundry open={openPrintLaundry} onClose={() => setOpenPrintLaundry(false)} data={row} />

      <ConfirmCancelOrder
        open={openCancel}
        isLoading={isLoading}
        handleClose={() => setOpenCancel(false)}
        handleClick={handleCancelOrder}
      />

      <ConfirmDialog
        title="Generate Point"
        text="Are you sure want to generate point for this order?"
        open={openGenerate}
        isLoading={isLoading}
        onClose={() => setOpenGenerate(false)}
        onClick={handleGeneratePoint}
      />

      <ConfirmDialog
        title="Cancel Payment"
        text="Are you sure want to cancel payment for this order?"
        open={openCancelPayment}
        isLoading={isLoading}
        onClose={() => setOpenCancelPayment(false)}
        onClick={handleCancelPayment}
      />
    </>
  );
}
