import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  IconButton,
  styled,
  FormControlLabel,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import Iconify from '../../../../components/Iconify';
// import CustomSwitch from "../../../../components/CustomSwitch";
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
// utils
import { handleMutationFeedback } from '../../../../utils/mutationfeedback';
import { combinedDateTime, numberWithCommas } from '../../../../utils/getData';
import usePickup from '../../../../pages/pickup/service/usePickup';

// ----------------------------------------------------------------------

ModalPickup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
};

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

export default function ModalPickup(props) {
  const { updateRaw } = usePickup();
  const ctx = useContext(cashierContext);
  const navigate = useNavigate();
  const {
    _id,
    orderId,
    date,
    customer,
    customerRef,
    orders,
    listSpk,
    orderType,
    dp,
    serviceCharge,
    serviceChargePercentage,
    tax,
    taxPercentage,
    discount,
    discountPrice,
    voucherCode,
    voucherDiscPrice,
    deliveryPrice,
    havePaid,
    isScan,
    status,
  } = props.data;
  const { enqueueSnackbar } = useSnackbar();

  const hasSpk = listSpk?.length > 0;
  const [pickupDate, setPickupDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [name, setName] = useState(customer?.name || '');
  const [checkAll, setCheckAll] = useState(false);
  const [listPickUp, setListPickUp] = useState([]);

  const showOrderType = () => {
    if (orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

  const handleClose = () => {
    props.onClose();
    setTimeout(() => {
      setName(customer?.name || '');
      setCheckAll(false);
      setListPickUp([]);
    }, 500);
  };

  const handleCheckAll = () => {
    if (!checkAll) {
      // CHECK ALL
      const items = hasSpk ? listSpk : orders;
      const all = items
        .map((item, index) => {
          if (!item.isPickedUp) {
            return {
              _id: item._id,
              id: item.id,
              name: item.name,
              variant: item.variant,
              index,
            };
          }
          return null;
        })
        .filter(Boolean);

      setListPickUp(all);
      setCheckAll(true);
    } else {
      // UNCHECK ALL
      setListPickUp([]);
      setCheckAll(false);
    }
  };

  const handleChecked = (e, item, index) => {
    if (e.target.checked) {
      setListPickUp((curr) => {
        const updated = [...curr, { _id: item._id, id: item.id, name: item.name, variant: item.variant, index }];
        const items = hasSpk ? listSpk : orders;
        // Hitung berapa item yang sebenarnya bisa dicheck
        const totalCheckable = items.filter((o) => !o.isPickedUp).length;
        // Jika jumlah item yang dicentang == jumlah item yang bisa dicentang ⇒ aktifkan checkAll
        if (updated.length === totalCheckable) {
          setCheckAll(true);
        }

        return updated;
      });
    } else {
      setListPickUp((curr) => curr.filter((row) => row.index !== index));
      // Uncheck satu item → checkAll otomatis false
      setCheckAll(false);
    }
  };

  const handleSubmit = async () => {
    // console.log(listPickUp);

    setIsLoading(true);
    if (name === '') {
      setIsLoading(false);
      return setAlert(true);
    }

    const objPickUp = {
      date: combinedDateTime(pickupDate),
      by: name,
      status: checkAll ? 'completed' : 'outstanding',
    };

    // ================= MERGE SPK =================
    const mergedSpk = listSpk?.map((item, idx) => {
      const picked = listPickUp?.find((p) => p.index === idx);

      if (picked) {
        return {
          ...item,
          isPickedUp: true,
          pickupData: objPickUp,
        };
      }

      return item;
    });

    // ================= BUILD MAP (ONLY IF SPK EXISTS) =================
    let spkMap = null;

    if (mergedSpk?.length > 0) {
      spkMap = {};

      mergedSpk.forEach((spk) => {
        const key = spk.id;

        if (!spkMap[key]) {
          spkMap[key] = {
            totalQty: 0,
            pickedQty: 0,
          };
        }

        spkMap[key].totalQty += Number(spk.qty || 0);

        if (spk.isPickedUp) {
          spkMap[key].pickedQty += Number(spk.qty || 0);
        }
      });
    }

    // ================= MERGE ORDERS =================
    const mergedOrders = orders?.map((item, idx) => {
      // ===== CASE 1: DATA BARU (pakai SPK) =====
      if (spkMap) {
        const data = spkMap[item.id];

        if (!data) return item;

        const isFullyPicked =
          Math.round(data.totalQty * 10) === Math.round(data.pickedQty * 10);

        if (isFullyPicked) {
          return {
            ...item,
            isPickedUp: true,
            pickupData: objPickUp,
          };
        }

        return item;
      }

      // ===== CASE 2: DATA LAMA (tanpa SPK) =====
      const picked = listPickUp?.find((p) => p.index === idx);

      if (picked) {
        return {
          ...item,
          isPickedUp: true,
          pickupData: objPickUp,
        };
      }

      return item;
    });

    // const mergedOrders = orders?.map((item, idx) => {
    //   const picked = listPickUp.find((p) => p.index === idx);

    //   if (picked) {
    //     return {
    //       ...item,
    //       isPickedUp: true,
    //       pickupData: objPickUp,
    //     };
    //   }

    //   return item; // biarkan apa adanya
    // });

    if (status !== 'paid') {
      ctx.handleResetPos();
      ctx.setCurrentOrderID(_id);
      ctx.setDisplayOrderID(orderId);
      ctx.setBill(mergedOrders);
      if (mergedSpk?.length > 0) {
        ctx.setSpk(mergedSpk);
      }
      ctx.setOrderDate(date);
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

      ctx.setPickupData(objPickUp);

      setTimeout(() => {
        navigate(PATH_DASHBOARD.cashier.pos);
        setIsLoading(false);
      }, 100);
      setAlert(false);
    } else {
      const objData = {
        ...(mergedOrders?.length > 0 && {
          orders: mergedOrders
        }),
        ...(mergedSpk?.length > 0 && {
          listSpk: mergedSpk
        }),
        pickupData: objPickUp,
        pickUpStatus: objPickUp.status || 'completed',
      }

      const mutation = updateRaw.mutateAsync({ id: _id, payload: objData });
      await handleMutationFeedback(mutation, {
        successMsg: 'Order picked up!',
        errorMsg: 'Gagal update data!',
        onSuccess: () => {
          setIsLoading(false);
          handleClose();
        },
        enqueueSnackbar,
      });
    }
  };

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="sm" open={props.open}>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        style={{ borderBottom: '1px solid #ccc' }}
      >
        PickUp Detail
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Stack flexDirection={{ sm: 'column', md: 'row' }} gap={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="PickUp Date"
              inputFormat="dd/MM/yyyy"
              value={pickupDate}
              onChange={(newValue) => {
                setPickupDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
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
          <TextField
            name="by"
            label="PickUp By"
            fullWidth
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name && alert ? Boolean(true) : Boolean(false)}
            helperText={!name && alert ? 'PickUp By is required' : ''}
          />
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <FormControlLabel
          label={<b>PickUp All</b>}
          control={<Checkbox checked={checkAll} onChange={() => handleCheckAll()} />}
        />
        <Grid container rowGap={2}>
          {hasSpk ? (
            listSpk?.map((item, i) => (
              <Grid item xs={6} key={i}>
                <FormControlLabel
                  label={
                    <div>
                      <p>{item.spkId}</p>
                      <p>{item.name} {numberWithCommas(item?.qty || 0)}{item?.unit}</p>
                      {item.variant &&
                        item.variant.map((variant, v) => (
                          <p key={v} style={{ fontSize: '0.80rem', opacity: '0.7' }}>{`${variant.name} : ${variant.option
                            } ${variant.qty > 1 ? `(x${variant.qty})` : ''}`}</p>
                        ))}
                      {item.notes && <p style={{ fontSize: '0.80rem', opacity: '0.7' }}>Notes : {item.notes}</p>}
                    </div>
                  }
                  control={
                    <Checkbox
                      disabled={item.isPickedUp}
                      checked={item.isPickedUp || listPickUp.some((row) => row.index === i)}
                      onChange={(e) => handleChecked(e, item, i)}
                    />
                  }
                />
              </Grid>
            ))
          ) : (
            orders.map((item, i) => (
              <Grid item xs={6} key={i}>
                <FormControlLabel
                  label={
                    <div>
                      <p>{item.name} {numberWithCommas(item?.qty || 0)}{item?.unit}</p>
                      {item.variant &&
                        item.variant.map((variant, v) => (
                          <p key={v} style={{ fontSize: '0.80rem', opacity: '0.7' }}>{`${variant.name} : ${variant.option
                            } ${variant.qty > 1 ? `(x${variant.qty})` : ''}`}</p>
                        ))}
                      {item.notes && <p style={{ fontSize: '0.80rem', opacity: '0.7' }}>Notes : {item.notes}</p>}
                    </div>
                  }
                  control={
                    <Checkbox
                      disabled={item.isPickedUp}
                      checked={item.isPickedUp || listPickUp.some((row) => row.index === i)}
                      onChange={(e) => handleChecked(e, item, i)}
                    />
                  }
                />
              </Grid>
            ))
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pt: '10px !important' }}>
        <LoadingButton type="button" variant="contained" loading={isLoading} onClick={() => handleSubmit()}>
          Submit
        </LoadingButton>
      </DialogActions>
    </BootstrapDialog>
  );
}
