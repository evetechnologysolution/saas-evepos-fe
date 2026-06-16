/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Link,
  IconButton,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';
import { maskedPhone } from '../../../utils/masked';

// ----------------------------------------------------------------------

OrdersTableRow.propTypes = {
  row: PropTypes.object,
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

export default function OrdersTableRow({ row }) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    _id,
    orderId,
    createdAt,
    paymentDate,
    customer,
    orders,
    orderType,
    status,
    discountPrice,
    discountLabel,
    voucherDiscPrice,
    deliveryPrice,
    deliveryPriceDisc,
    billedAmount,
    payment,
    cardBankName,
    cardAccountName,
    cardNumber,
    transfer,
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showOrderType = () => {
    if (orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(paymentDate)}</TableCell>

        <TableCell align="center">{formatDate2(createdAt)}</TableCell>

        <TableCell>
          <Stack flexDirection="row" gap={1}>
            <Label variant="ghost" color={showOrderType() === 'Onsite' ? 'default' : 'info'}>
              {showOrderType()}
            </Label>
            {transfer?.toOutletRef && (
              <Label variant="ghost" color="error">
                Transfer
              </Label>
            )}
          </Stack>
          <Stack flexDirection="row" gap={0.5}>
            {['owner', 'admin']?.includes(user?.role?.toLowerCase()) && (
              <ButtonBase
                type="button"
                title="Copy ID"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(orderId);
                    enqueueSnackbar('Sukses menyalin orderId !');
                  } catch (error) {
                    enqueueSnackbar('Terjadi kesalahan saat menyalin orderId !', { variant: 'error' });
                  }
                }}
              >
                <Iconify icon="mage:copy" width={20} height={20} />
              </ButtonBase>
            )}

            {['owner', 'admin', 'cashier']?.includes(user?.role?.toLowerCase()) ? (
              <Link
                component="button"
                variant="subtitle2"
                underline="hover"
                onClick={() => navigate(`/dashboard/transaction-log/${_id}/detail`)}
              >
                {!orderId ? _id : orderId}
              </Link>
            ) : !orderId ? (
              _id
            ) : (
              orderId
            )}
          </Stack>
        </TableCell>

        <TableCell align="left">
          <p>{customer?.name || '-'}</p>
          {customer?.phone && (
            <p>
              {!customer?.phone?.includes('EM')
                ? maskedPhone(['owner', 'super admin']?.includes(user?.role), customer?.phone) || '-'
                : '-'}
            </p>
          )}
          <Label variant="ghost" color={isScan ? 'info' : 'default'}>
            {isScan ? 'Scan' : 'Tidak Scan'}
          </Label>
        </TableCell>

        <TableCell>
          {orders.length > 0 ? (
            <>
              {orders[0].qty === 0 && orders[0]?.category?.toLowerCase() === 'kiloan' ? (
                <p>
                  {orders[0].name} <em style={{ color: 'red' }}>{'(Belum ditimbang)'}</em>
                </p>
              ) : (
                <p>{`x ${orders[0].qty}${orders[0]?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''} ${orders[0].name}`}</p>
              )}
              {orders[0].variant.length > 0 &&
                orders[0].variant.map((item, i) => (
                  <p key={i}>
                    <em>{`${item?.name} : ${item?.option} ${item?.qty > 1 ? `(x${item?.qty})` : ''}`}</em>
                  </p>
                ))}
              {orders[0].notes && (
                <p>
                  <em>Notes : {orders[0].notes}</em>
                </p>
              )}
              {orders[0].promotionLabel && (
                <p>
                  <em>{`(${orders[0].promotionLabel})`}</em>
                </p>
              )}
              {orders.length > 1 && (
                <Link component="button" variant="inherit" underline="hover" onClick={handleOpen}>
                  {`+${orders.length - 1} produk lainnya`}
                </Link>
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

        <TableCell align="center" sx={{ color: status?.toLowerCase() === 'refund' ? 'red' : '#212B36' }}>
          {deliveryPrice ? (
            deliveryPriceDisc ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "red",
                    opacity: 0.7,
                  }}
                >
                  Rp. {numberWithCommas(deliveryPrice)}
                </span>
                <br />
                <span>
                  Rp. {numberWithCommas(deliveryPrice - deliveryPriceDisc)}
                </span>
              </>
            ) : (
              <span>Rp. {numberWithCommas(deliveryPrice)}</span>
            )
          ) : (
            "-"
          )}
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

        <TableCell align="center">
          <div>
            {payment || "-"}
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
                const originPrice = item?.price;
                return (
                  <tr key={i}>
                    <td style={{ padding: '0.2rem 0' }}>
                      <p>{item?.name}</p>
                      {item?.variant?.length > 0 &&
                        item?.variant?.map((field, v) => (
                          <p key={v}>
                            <em>{`${field?.name} : ${field?.option} ${field?.qty > 1 ? `(x${field?.qty})` : ''}`}</em>
                          </p>
                        ))}
                      {item?.notes && (
                        <p>
                          <em>Notes : {item?.notes}</em>
                        </p>
                      )}
                      {item?.promotionLabel && (
                        <p>
                          <em>{`(${item?.promotionLabel})`}</em>
                        </p>
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
                          color: item?.promotionType === 1 || item?.promotionType === 2 ? 'red' : '#212B36',
                          textDecoration:
                            item?.promotionType === 1 || item?.promotionType === 2 ? 'line-through' : 'none',
                        }}
                      >
                        Rp. {numberWithCommas(Math.round(item?.qty * originPrice))}
                      </span>
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
    </>
  );
}
