import { useState } from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
// utils
import { formatDate2, numberWithCommas } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';
// context
import ModalPickup from './ModalPickup';

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

  const {
    _id,
    orderId,
    createdAt,
    paymentDate,
    customer,
    orders,
    orderType,
    notes,
    status,
    discountPrice,
    voucherDiscPrice,
    billedAmount,
    payment,
    cardBankName,
    cardAccountName,
    cardNumber,
    pickUpStatus,
    pickupData,
    progressRef,
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

  const [openPickup, setOpenPickup] = useState(false);

  const showOrderType = () => {
    if (orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

  const handlePay = async () => {
    setOpenPickup(true);
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(createdAt)}</TableCell>

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
          {!orderId ? _id : orderId}
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
        </TableCell>

        <TableCell>
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
                <em>{`${item.name} : ${item.option} ${item.qty > 1 ? `(x${item.qty})` : ''}`}</em>
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
              <Link component="button" variant="inherit" underline="hover" onClick={() => setOpen(true)}>
                {`+${orders.length - 1} produk lainnya`}
              </Link>
            </>
          )}
        </TableCell>

        <TableCell align="left">
          {pickUpStatus !== 'pending' ? (
            <>
              <p>{pickupData?.by || customer.name}</p>
              <p>{formatDate2(pickupData?.date || paymentDate)}</p>
            </>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell align="center">{progressRef?.latestNotes || '-'}</TableCell>

        <TableCell align="center">
          <Label variant="ghost" color={statusColor} sx={{ textTransform: 'capitalize' }}>
            {/* {status === 'unpaid' ? 'unpaid' : status} */}
            {progressRef?.latestStatus}
          </Label>
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
        </TableCell>

        <TableCell align="center">
          <div>
            {payment || '-'}
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

        <TableCell align="center">
          {pickUpStatus !== 'completed' ? (
            <Button type="button" variant="contained" onClick={() => handlePay()}>
              {status === 'paid' ? 'PickUp' : 'Pay & PickUp'}
            </Button>
          ) : (
            '-'
          )}
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
          onClose={() => setOpen(false)}
          style={{ borderBottom: '1px solid #ccc' }}
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
              {orders.map((item, i) => {
                let originPrice = item.price;
                if (item.isLaundryBag) {
                  originPrice += item.discountLaundryBag;
                }
                return (
                  <tr key={i}>
                    <td style={{ padding: '0.2rem 0' }}>
                      {item.name}
                      {item.variant.length > 0 &&
                        item.variant.map((field, v) => (
                          <span key={v}>
                            <br />
                            <em>{`${field.name} : ${field.option} ${field.qty > 1 ? `(x${field.qty})` : ''}`}</em>
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
                          <em>
                            Laundry Bag Day :{' '}
                            {`(-Rp. ${numberWithCommas(Math.round(item.discountLaundryBag * item.qty))})`}
                          </em>
                        </span>
                      )}
                    </td>
                    <td align="center">
                      {item.qty === 0 && item?.category?.toLowerCase() === 'kiloan' ? (
                        <em style={{ color: 'red' }}>{'(Belum ditimbang)'}</em>
                      ) : (
                        `x ${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''}`
                      )}
                    </td>
                    <td align="right">
                      <span
                        style={{
                          color:
                            item.promotionType === 1 || item.promotionType === 2 || item.isLaundryBag
                              ? 'red'
                              : '#212B36',
                          textDecoration:
                            item.promotionType === 1 || item.promotionType === 2 || item.isLaundryBag
                              ? 'line-through'
                              : 'none',
                        }}
                      >
                        Rp. {numberWithCommas(Math.round(item.qty * originPrice))}
                      </span>
                      {item.isLaundryBag && item.discountLaundryBag && (
                        <>
                          <br />
                          <span
                            style={{
                              textDecoration: item.promotionType === 1 && item.isLaundryBag ? 'line-through' : 'none',
                            }}
                          >
                            Rp. {numberWithCommas(Math.round(item.qty * item.price))}
                          </span>
                          <br />
                        </>
                      )}
                      {item.promotionType === 1 && (
                        <>
                          <br />
                          <span>
                            Rp.{' '}
                            {numberWithCommas(
                              Math.round(item.qty * item.price) -
                                (Math.round(item.qty * item.price) * item.discountAmount) / 100
                            )}
                          </span>
                          <br />
                        </>
                      )}
                      {item.promotionType === 2 && (
                        <>
                          <br />
                          <span>
                            Rp. {numberWithCommas(Math.round(item.qty * item.price) - Math.round(item.discountAmount))}
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

      <ModalPickup open={openPickup} onClose={() => setOpenPickup(false)} data={row} />
    </>
  );
}
