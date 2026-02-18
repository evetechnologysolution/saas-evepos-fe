import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// @mui
import {
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../../../utils/axios';
// components
import Iconify from '../../../../components/Iconify';
import { paymentOptions, bankOptions } from '../../../../_mock/paymentOptions';
// utils
import { cardNumberFormat, resetCardNumberFormat } from '../../../../utils/getData';

// ----------------------------------------------------------------------

ModalChangePayment.propTypes = {
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

export default function ModalChangePayment(props) {
  const { data, open, onClose } = props;

  const client = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const [payment, setPayment] = useState(data?.payment || '');
  const [cardBankName, setCardBankName] = useState(data?.cardBankName || '');
  const [cardAccountName, setCardAccountName] = useState(data?.cardAccountName || '');
  const [cardNumber, setCardNumber] = useState(data?.cardNumber || '');
  const [payDate, setPayDate] = useState(new Date(data?.paymentDate));

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPayment(data?.payment || '');
      setCardBankName(data?.cardBankName || '');
      setCardAccountName(data?.cardAccountName || '');
      setCardNumber(data?.cardNumber || '');
    }, 500);
  };

  const handleCard = (e) => {
    if (resetCardNumberFormat(e).length <= 16) {
      setCardNumber(e);
    }
  };

  const handleSelect = (val) => {
    setPayment(val);
    if (val !== 'Bank Transfer' || val !== 'Card') {
      setCardBankName('');
      setCardAccountName('');
      setCardNumber('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const objData = {
        payment,
        paymentDate: payDate,
        cardBankName,
        cardAccountName,
        cardNumber,
      };
      await axios.patch(`/order/raw/${data._id}`, objData);
      client.invalidateQueries('listOrders');

      handleClose();
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Refund failed!', { variant: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="sm" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          Detail
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSave}>
            <Stack gap={2}>
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
                name="payment"
                label="Payment"
                select
                fullWidth
                value={payment}
                onChange={(e) => handleSelect(e.target.value)}
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
              <Stack alignItems="center">
                <LoadingButton
                  variant="contained"
                  loading={isLoading}
                  disabled={payment !== '' ? Boolean(false) : Boolean(true)}
                  type="submit"
                >
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
