import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { sumBy } from 'lodash';
// import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import axios from '../../../../utils/axios';
// mock
import { paymentOptions, bankOptions } from '../../../../_mock/paymentOptions';
// hooks
import useAuth from '../../../../hooks/useAuth';
import Label from '../../../../components/Label';
// import Image from "../../../../components/Image";
import ConfirmDialog from '../../../../components/ConfirmDialog';
import Scrollbar from '../../../../components/Scrollbar';
import { formatDate2, numberWithCommas, cardNumberFormat, resetCardNumberFormat } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// context
import './OrdersForm.scss';

// ----------------------------------------------------------------------

OrdersForm.propTypes = {
  currentData: PropTypes.object,
};

export default function OrdersForm({ currentData }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [isNull, setIsNull] = useState(true);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('');
  const [data, setData] = useState({});
  const [orderDate, setOrderDate] = useState(null);
  const [originPayDate, setOriginPayDate] = useState(null);
  const [payDate, setPayDate] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [payment, setPayment] = useState('');
  const [cardBankName, setCardBankName] = useState('');
  const [cardAccountName, setCardAccountName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

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

  const sumTotalPrice =
    Number(subtotalPrice || 0) -
    Number(data?.voucherDiscPrice || 0) -
    Number(data?.discountPrice || 0) +
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
    setOrderDate(new Date(currentData?.createdAt));
    setOriginPayDate(new Date(currentData?.paymentDate));
    setPayDate(new Date(currentData?.paymentDate));
    setPayment(currentData?.payment || '');
    setCardBankName(currentData?.cardBankName || '');
    setCardAccountName(currentData?.cardAccountName || '');
    setCardNumber(currentData?.cardNumber || '');
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

  const showOrderType = () => {
    if (data?.orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

  const handleCard = (e) => {
    if (resetCardNumberFormat(e).length <= 16) {
      setCardNumber(e);
    }
  };

  const handlePaySelect = (val) => {
    setPayment(val);
    if (val !== 'Bank Transfer' || val !== 'Card') {
      setCardBankName('');
      setCardAccountName('');
      setCardNumber('');
    }
  };

  const handleChecked = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setPayDate(new Date());
    } else {
      setPayDate(originPayDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // cek required sudah diisi semua atau belum
    if (!e.target.checkValidity()) {
      return;
    }
    setOpenConfirm(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const updatedOrder = {
      createdAt: orderDate,
      paymentDate: payDate,
      payment,
      cardBankName,
      cardAccountName,
      cardNumber,
    };
    await axios.patch(`/order/raw/${data?._id}`, updatedOrder);
    setData((prev) => ({
      ...prev,
      ...updatedOrder,
    }));
    setOpenConfirm(false);
    setLoading(false);
    enqueueSnackbar(`Update Order ${data?.orderId} success!`);
    // navigate(PATH_DASHBOARD.cashier.delivery);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Stack>
                  <Typography variant="subtitle2">Order ID</Typography>
                  <Stack flexDirection="row" gap={2}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {data?.orderId || '-'}
                    </Typography>
                    {data?.orderType && (
                      <Label variant="ghost" color={showOrderType() === 'Onsite' ? 'default' : 'info'}>
                        {showOrderType()}
                      </Label>
                    )}
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
                  </tbody>
                </table>

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
                        <th>
                          <Typography variant="subtitle2" align="center">
                            Picked Up By
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
                                    <em>{`${field.name} : ${field.option}`}</em>
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
                              <Typography variant="body2" align="center">{`x ${item.qty} ${item?.unit || 'pcs'}`}</Typography>
                            </td>
                            <td>
                              {item?.isPickedUp ? (
                                <>
                                  <Typography variant="body2">{item?.pickupData?.by || data?.customer?.name}</Typography>
                                  <Typography variant="body2">{formatDate2(item?.pickupData?.date || data?.paymentDate)}</Typography>
                                </>
                              ) : (
                                '-'
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
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
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
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      <Stack>
                        <Typography variant="subtitle2">
                          Discount {data?.discount && data?.discountPrice ? `(${data?.discount}%)` : ''}
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{`(Rp. ${numberWithCommas(
                          data?.discountPrice || 0
                        )})`}</Typography>
                      </Stack>
                      <Stack>
                        <Typography variant="subtitle2">Delivery Fee</Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      <Stack>
                        <Typography variant="subtitle2">Total</Typography>
                        <Typography variant="h6" color="primary" sx={{ fontStyle: 'italic' }}>
                          Rp. {numberWithCommas(sumTotalPrice || 0)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>

                <Stack flexDirection="row" flexWrap="wrap" gap={3}>
                  {data?.date && orderDate && (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDateTimePicker
                        label="Order Date"
                        inputFormat="dd/MM/yyyy HH:mm"
                        ampm={false}
                        value={orderDate}
                        onChange={(newValue) => {
                          setOrderDate(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <img src="/assets/calender-icon.svg" alt="icon" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                  {data?.status === 'paid' && payDate && (
                    <>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateTimePicker
                          label="Payment Date"
                          inputFormat="dd/MM/yyyy HH:mm"
                          ampm={false}
                          value={payDate}
                          onChange={(newValue) => {
                            setPayDate(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ width: { xs: '100%', sm: 'auto' } }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <img src="/assets/calender-icon.svg" alt="icon" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        // disabled={Boolean(isChecked)}
                        />
                      </LocalizationProvider>

                      <TextField
                        name="payment"
                        label="Payment"
                        select
                        fullWidth
                        value={payment}
                        onChange={(e) => handlePaySelect(e.target.value)}
                      >
                        {paymentOptions.map((option) => (
                          <MenuItem
                            key={option}
                            value={option}
                            sx={{
                              mx: 1,
                              my: 0.5,
                              borderRadius: 0.75,
                              typography: 'body2',
                              textTransform: 'capitalize',
                            }}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>

                      {(payment === 'Bank Transfer' || payment === 'Card') && (
                        <TextField
                          id="bankName"
                          name="bankName"
                          label="Bank Name"
                          select
                          fullWidth
                          required={payment === 'Bank Transfer' || payment === 'Card' ? Boolean(true) : Boolean(false)}
                          value={cardBankName}
                          onChange={(e) => setCardBankName(e.target.value)}
                        >
                          {bankOptions.map((option, n) => (
                            <MenuItem
                              key={n}
                              value={option}
                              sx={{
                                mx: 1,
                                my: 0.5,
                                borderRadius: 0.75,
                                typography: 'body2',
                                textTransform: 'capitalize',
                              }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      {payment === 'Card' && (
                        <>
                          <TextField
                            id="accountName"
                            name="accountName"
                            type="text"
                            label="Account Name"
                            autoComplete="off"
                            fullWidth
                            required={payment === 'Card' ? Boolean(true) : Boolean(false)}
                            onChange={(e) => setCardAccountName(e.target.value)}
                            value={cardAccountName}
                          />
                          <TextField
                            id="card"
                            name="card"
                            type="text"
                            label="Card Number"
                            autoComplete="off"
                            fullWidth
                            required={payment === 'Card' ? Boolean(true) : Boolean(false)}
                            onChange={(e) => handleCard(e.target.value)}
                            value={cardNumber ? cardNumberFormat(cardNumber) : ''}
                          />
                        </>
                      )}
                      <FormGroup sx={{ mb: 1 }}>
                        <FormControlLabel
                          control={<Checkbox checked={isChecked} onChange={handleChecked} />}
                          label="Ubah tanggal bayar menjadi tanggal & waktu saat ini."
                        />
                      </FormGroup>
                    </>
                  )}
                </Stack>

                <Stack>
                  <Typography variant="subtitle2">Progress</Typography>
                  <Scrollbar>
                    <table style={{ width: '100%' }} className="styled-table">
                      <thead>
                        <tr>
                          <th width={150}>
                            <Typography variant="subtitle2" align="center">
                              Date
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Item
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Qty
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Staff
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Proses
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Notes
                            </Typography>
                          </th>
                          {/* <th width={100}><Typography variant="subtitle2" align="center">Qty</Typography></th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {data?.progressRef && data?.progressRef?.log?.length > 0 ? (
                          data.progressRef.log
                            .slice()
                            .reverse()
                            .map((item, i) => (
                              <tr key={i}>
                                <td style={{ textAlign: 'center' }}>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {item?.date ? formatDate2(item?.date) : '-'}
                                  </Typography>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <Typography variant="body2">{item?.name || '-'}</Typography>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <Typography variant="body2">
                                    {item?.qty ? `${item?.qty} ${item?.unit}` : '-'}
                                  </Typography>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <Typography variant="body2">{item?.staffRef?.fullname || '-'}</Typography>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <Label variant="ghost" color="warning" sx={{ textTransform: 'capitalize' }}>
                                    {item?.status || '-'}
                                  </Label>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <Typography variant="body2">{item?.notes || '-'}</Typography>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={100} style={{ textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                Belum ada data
                              </Typography>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Scrollbar>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
            <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.cashier.orders)}>
              Back
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Update
            </LoadingButton>
          </Stack>
        </Card>
      </form>

      <ConfirmDialog
        open={openConfirm}
        isLoading={loading}
        onClose={() => setOpenConfirm(false)}
        onClick={handleUpdate}
        title="Confirm Update"
        text="Are you sure want to update data?"
      />
    </>
  );
}
