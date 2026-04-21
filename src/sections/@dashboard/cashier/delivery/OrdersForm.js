import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { sumBy } from 'lodash';
// import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Button, TextField, Link, InputAdornment } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
import Label from '../../../../components/Label';
// import Image from '../../../../components/Image';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { formatDate, formatDate2, numberWithCommas } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
import './OrdersForm.scss';

// ----------------------------------------------------------------------

OrdersForm.propTypes = {
  currentData: PropTypes.object,
};

export default function OrdersForm({ currentData }) {
  const { user } = useAuth();
  const currTheme = useTheme();
  const navigate = useNavigate();
  const ctx = useContext(cashierContext);

  const { enqueueSnackbar } = useSnackbar();

  const [isNull, setIsNull] = useState(true);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('');
  const [data, setData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);

  // first wash
  const minFirstBilled = 40000;
  const maxFirstDiscPrice = 30000;
  const firstDisc = 50;

  const subtotalPrice = sumBy(data?.orders, (item) => {
    const tot = Math.round((item?.price || 0) * (item?.qty || 0));
    if (item?.promotionType === 1) {
      return tot - (tot * (item?.discountAmount || 0)) / 100;
    }
    if (item?.promotionType === 2) {
      return tot - item?.discountAmount;
    }
    return tot;
  });
  const sumProductionPrice = sumBy(data?.orders, (item) => Math.round((item?.productionPrice || 0) * (item?.qty || 0)));

  useEffect(() => {
    let fixDiscPrice = subtotalPrice * (discount / 100);
    if (currentData?.discountLabel === 'FIRST WASH' && subtotalPrice >= minFirstBilled) {
      const checkFirstDiscPrice = subtotalPrice * (firstDisc / 100);
      if (checkFirstDiscPrice > maxFirstDiscPrice) {
        fixDiscPrice = maxFirstDiscPrice;
      } else {
        fixDiscPrice = subtotalPrice * (firstDisc / 100);
      }
    }
    setDiscountPrice(fixDiscPrice);
  }, [subtotalPrice, discount, currentData?.discountLabel, currentData?.discountPrice]);

  const sumTotalPrice =
    Number(subtotalPrice || 0) -
    Number(data?.voucherDiscPrice || 0) -
    Number(discountPrice || 0) +
    (Number(data?.deliveryPrice || 0) - Number(data?.deliveryPriceDisc || 0));

  useEffect(() => {
    const regionParts = [
      currentData?.customer?.province || '',
      currentData?.customer?.city || '',
      currentData?.customer?.district || '',
      currentData?.customer?.subdistrict || '',
    ];

    setRegion(regionParts.filter((part) => part).join(', '));
    setData(currentData);
    setDiscount(currentData?.discount);
    setDiscountPrice(currentData?.discountPrice);
  }, [currentData]);

  useEffect(() => {
    const check =
      data?.orders?.some((item) => item?.category?.toLowerCase() === 'kiloan' && Number(item?.qty) === 0) || false;

    setIsNull(check);
  }, [data]);

  let statusColor;
  if (data?.status?.toLowerCase() === 'paid') {
    statusColor = 'success';
  } else if (data?.status?.toLowerCase() === 'half paid') {
    statusColor = 'secondary';
  } else if (data?.status?.toLowerCase() === 'unpaid') {
    statusColor = 'warning';
  } else if (data?.status?.toLowerCase() === 'refund') {
    statusColor = 'default';
  } else if (data?.status?.toLowerCase() === 'backlog') {
    statusColor = 'default';
  } else {
    statusColor = 'error';
  }

  const [openCancel, setOpenCancel] = useState(false);
  const handleCloseCancel = () => setOpenCancel(false);

  const handleCancelOrder = async () => {
    setLoading(true);
    await ctx.updateOrders(data?._id, { status: 'cancel' });
    setData((prev) => ({
      ...prev,
      status: 'cancel',
    }));
    setOpenCancel(false);
    setLoading(false);
    enqueueSnackbar(`Cancel Order ${data?.orderId} success!`);
  };

  const [openPending, setOpenPending] = useState(false);
  const handleClosePending = () => setOpenPending(false);

  const checkPending = () => {
    if (data?.orders?.find((item) => item?.category?.toLowerCase() === 'kiloan' && item?.qty < 3)) {
      alert('*Jika cuci kiloan < 3kg, mohon bulatkan ke 3kg.');
      return;
    }
    setOpenPending(true);
  };

  const handlePendingOrder = async () => {
    if (data?.orders?.find((item) => item?.category?.toLowerCase() === 'kiloan' && item?.qty < 3)) {
      alert('*Jika cuci kiloan < 3kg, mohon bulatkan ke 3kg.');
      return;
    }
    setLoading(true);
    const updatedOrder = {
      date: new Date(),
      status: 'unpaid',
      discountPrice,
      productionAmount: sumProductionPrice,
      havePaid: 0,
      billedAmount: sumTotalPrice,
    };
    await ctx.updateOrders(data?._id, {
      ...data,
      ...updatedOrder,
    });
    setData((prev) => ({
      ...prev,
      ...updatedOrder,
    }));
    setOpenPending(false);
    setLoading(false);
    enqueueSnackbar(`Update Order ${data?.orderId} success!`);
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Booking Date</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {data?.bookingDate ? formatDate2(data?.bookingDate) : data?.date ? formatDate2(data?.date) : '-'}
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Order ID</Typography>
                <Stack flexDirection="row" gap={2}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {data?.orderId || '-'}
                  </Typography>
                  {data?.status && (
                    <Label variant="ghost" color={statusColor} sx={{ textTransform: 'capitalize' }}>
                      {data?.status}
                    </Label>
                  )}
                </Stack>
              </Stack>
              <table className="styled-table">
                <tbody>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Pickup Schedule</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data
                          ? data?.isDropOff
                            ? 'Customer bawa sendiri ke outlet (Self DropOff)'
                            : data?.pickupDateTime
                              ? formatDate(data?.pickupDateTime)
                              : '-'
                          : '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Delivery Schedule</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data
                          ? data?.selfPickup
                            ? 'Customer ambil sendiri di outlet (Self PickUp)'
                            : data?.deliveryDate
                              ? formatDate(data?.deliveryDate)
                              : 'Konfirmasi sebelum antar'
                          : '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Customer Name</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data?.customer?.name || '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Phone</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data?.customer?.phone && !data?.customer?.phone?.includes('EM')
                          ? maskedPhone(['owner', 'super admin']?.includes(user?.role), data?.customer?.phone)
                          : '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Email</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data?.customer?.email || '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Region</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {region || '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Address</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data?.customer?.address || '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Address Detail</Typography>
                    </th>
                    <td>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {data?.customer?.addressNotes || '-'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Typography variant="subtitle2">Location</Typography>
                    </th>
                    <td>
                      {data?.customer?.location?.lat && data?.customer?.location?.lng ? (
                        <Typography
                          component={Link}
                          variant="body2"
                          href={`https://www.google.com/maps/?q=${data?.customer?.location?.lat},${data?.customer?.location?.lng}`}
                          target="_blank"
                          sx={{ fontStyle: 'italic' }}
                        >
                          Lihat di Google Maps
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          Tidak tersedia
                        </Typography>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Order</Typography>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>
                        <Typography variant="subtitle2">Items</Typography>
                      </th>
                      <th>
                        <Typography variant="subtitle2" align="center">
                          Price
                        </Typography>
                      </th>
                      <th>
                        <Typography variant="subtitle2" align="center">
                          Quantity
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.orders?.map((item, i) => {
                      const originPrice = item.price;
                      return (
                        <tr key={i}>
                          <td>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {item.name}
                            </Typography>
                            {item.variant.length > 0 &&
                              item.variant.map((field, v) => (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }} key={v}>
                                  <em>{`${field.name} : ${field.option} ${field.qty > 1 ? `(x${field.qty})` : ''}`}</em>
                                </Typography>
                              ))}
                            {item.promotionLabel && (
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                <em>{`(${item.promotionLabel})`}</em>
                              </Typography>
                            )}
                          </td>
                          <td>
                            <Stack alignItems="center" justifyContent="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontStyle: 'italic',
                                  color: item.promotionType === 1 || item.promotionType === 2 ? 'red' : '#212B36',
                                  textDecoration:
                                    item.promotionType === 1 || item.promotionType === 2 ? 'line-through' : 'none',
                                }}
                              >
                                Rp. {numberWithCommas(Math.round(item.qty * originPrice))}
                              </Typography>
                              {item.promotionType === 1 && (
                                <>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'red' }}>
                                    Disc {item.discountAmount}%
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    Rp.{' '}
                                    {numberWithCommas(
                                      Math.round(item.qty * item.price) -
                                      (Math.round(item.qty * item.price) * item.discountAmount) / 100
                                    )}
                                  </Typography>
                                </>
                              )}
                              {item.promotionType === 2 && (
                                <>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'red' }}>
                                    Disc Rp. {numberWithCommas(item.discountAmount)}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    Rp.{' '}
                                    {numberWithCommas(
                                      Math.round(item.qty * item.price) - Math.round(item.discountAmount)
                                    )}
                                  </Typography>
                                </>
                              )}
                            </Stack>
                          </td>
                          <td>
                            {currentData?.orders?.[i]?.qty === 0 && item?.category?.toLowerCase() === 'kiloan' ? (
                              <Stack alignItems="center" justifyContent="center">
                                <Typography variant="body2" align="center" color="red">
                                  {'(Belum ditimbang)'}
                                </Typography>
                                <TextField
                                  size="small"
                                  name="quantity"
                                  autoComplete="off"
                                  autoFocus
                                  type="number"
                                  sx={{
                                    width: '100px',
                                    '& .MuiOutlinedInput-root': {
                                      paddingRight: '10px',
                                      '& fieldset': {
                                        borderColor: currTheme.palette.primary.light,
                                      },
                                      '&:hover fieldset': {
                                        borderColor: currTheme.palette.primary.light,
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: currTheme.palette.primary.light,
                                        border: `1px solid ${currTheme.palette.primary.main}`,
                                      },
                                    },
                                  }}
                                  InputProps={{
                                    inputProps: {
                                      min: item?.category?.toLowerCase() === 'kiloan' ? 3 : 1,
                                      style: { textAlign: 'center' },
                                    },
                                    endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                                  }}
                                  value={item.qty === 0 ? '' : item.qty}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/^0+/, ''); // Menghapus nol di awal
                                    const updatedQty = value === '' ? '' : Number(value);

                                    // Perbarui nilai item.qty
                                    const updatedOrders = data.orders.map((order, index) =>
                                      index === i ? { ...order, qty: updatedQty } : order
                                    );

                                    // Update state atau data
                                    setData((prevData) => ({
                                      ...prevData,
                                      orders: updatedOrders,
                                    }));
                                  }}
                                />
                              </Stack>
                            ) : (
                              <Typography variant="body2" align="center">{`x ${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''
                                }`}</Typography>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Notes</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {data?.notes || '-'}
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Sub Total</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Rp. {numberWithCommas(subtotalPrice || 0)}
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Voucher Discount</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{`(Rp. ${numberWithCommas(
                  data?.voucherDiscPrice || 0
                )})`}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">
                  Discount{discount ? ` (${data?.discountLabel !== 'FIRST WASH' ? `${discount}% ` : ''})` : ''}
                  {data?.discountLabel ? ` (${data?.discountLabel})` : ''}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{`(Rp. ${numberWithCommas(
                  discountPrice || 0
                )})`}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Delivery Fee</Typography>
                {data?.deliveryPriceDisc ? (
                  <Stack>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "red", textDecoration: "line-through", opacity: 0.7 }}>
                      Rp. {numberWithCommas(data?.deliveryPrice || 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>Rp. {numberWithCommas((data?.deliveryPrice || 0) - (data?.deliveryPriceDisc || 0))}</Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>Rp. {numberWithCommas(data?.deliveryPrice || 0)}</Typography>
                )}
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="h6" color="primary" sx={{ fontStyle: 'italic' }}>
                  Rp. {numberWithCommas(sumTotalPrice || 0)}
                </Typography>
              </Stack>
              {/* <Stack spacing={1}>
                <Typography variant="subtitle2">Image {!data?.invoiceImg?.image && <span>{`(empty)`}</span>}</Typography>
                <Zoom>
                  <Image
                    src={data?.invoiceImg?.image}
                    alt={data?.orderId}
                    sx={{ width: 300, height: 300, borderRadius: "3px", cursor: "zoom-in" }}
                  />
                </Zoom>
              </Stack> */}
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.cashier.delivery)}>
            Back
          </Button>
          {data?.status && data?.status === 'backlog' && (
            <>
              <LoadingButton variant="contained" color="error" loading={loading} onClick={() => setOpenCancel(true)}>
                Set to Canceled
              </LoadingButton>
              <LoadingButton variant="contained" disabled={isNull} loading={loading} onClick={() => checkPending()}>
                Move to Orders
              </LoadingButton>
            </>
          )}
        </Stack>
      </Card>

      <ConfirmDialog
        open={openCancel}
        isLoading={loading}
        onClose={handleCloseCancel}
        onClick={handleCancelOrder}
        title="Confirm Cancel Order"
        text="Are you sure want to cancel order?"
      />

      <ConfirmDialog
        open={openPending}
        isLoading={loading}
        onClose={handleClosePending}
        onClick={handlePendingOrder}
        title="Confirm Pending Order"
        text="Are you sure want to update order?"
      />
    </>
  );
}
