import React, { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
// @mui
import {
  Alert,
  Autocomplete,
  Button,
  styled,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import Iconify from '../../../../components/Iconify';
import CustomSwitch from '../../../../components/CustomSwitch';
import { maskedPhone } from '../../../../utils/masked';
// context
import { cashierContext } from '../../../../contexts/CashierContext';

// ----------------------------------------------------------------------

ModalInputCustomer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
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

export default function ModalInputCustomer(props) {
  const { user } = useAuth();
  const ctx = useContext(cashierContext);

  const [date, setDate] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [alert, setAlert] = useState(false);
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [point, setPoint] = useState(0);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (query) {
      setLoading(true);
      try {
        const res = await axios.get(`/member?search=${query}`);
        setMembers(res?.data?.docs || []);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    } else {
      const res = await axios.get('/member');
      setMembers(res?.data?.docs || []);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const onInputSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleChange = (_, val) => {
    setFullName(val ? val.name : '');
    setPhone(val ? val.phone : '');
    setPoint(val ? val.point : 0);
    if (!val) {
      debouncedSearch('');
    }
  };

  useEffect(() => {
    const fetchDefaultMembers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/member?perPage=30');
        setMembers(res?.data?.docs || []);
      } catch (error) {
        console.error('Error fetching default members:', error);
      } finally {
        setLoading(false);
      }
    };

    if (props.open) {
      if (ctx.customerName) {
        setDate(ctx.orderDate);
      } else {
        setDate(new Date());
      }
      setFullName(ctx.customerName);
      setPhone(ctx.customerPhone);
      setPoint(ctx.customerPoint);
      fetchDefaultMembers();
    }
  }, [props.open]);

  const handleReset = () => {
    props.onClose();
    setTimeout(() => {
      setDate(new Date());
      setFullName('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setPoint(0);
      setAlert(false);
      setIsNew(false);
    }, 500);
  };

  const handleCancel = () => {
    if (!ctx.customerName) {
      ctx.setOrderType('onsite');
    }
    handleReset();
  };

  const handleSwitch = () => {
    setFullName('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setPoint(0);
    setIsNew(!isNew);
    setAlert(false);
  };

  const handleSubmit = () => {
    if ((isNew && (!firstName || !lastName)) || (!isNew && !fullName) || !phone) {
      setAlert(true);
      return;
    }
    ctx.setOrderDate(date);
    ctx.setCustomerName(isNew ? `${firstName} ${lastName}` : fullName);
    ctx.setCustomerPhone(phone);
    ctx.setCustomerPoint(point);
    ctx.setCustomerNew(isNew);
    setAlert(false);
    setIsNew(false);
    handleReset();
  };

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="sm" open={props.open}>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        sx={{ m: 0, p: 2, borderBottom: '1px solid #ccc' }}
        onClose={handleCancel}
      >
        Input Customer
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Stack flexDirection="column" gap={2}>
          {isNew && (
            <Alert severity="warning">
              Jika <b>No. WA</b> belum ada, bisa diisi <b>62</b>
            </Alert>
          )}
          <Stack flexDirection="row" gap={2} alignItems="center">
            {isNew ? (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  fullWidth
                  autoComplete="off"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!firstName && alert ? Boolean(true) : Boolean(false)}
                  helperText={!firstName && alert ? 'First Name is required' : ''}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  autoComplete="off"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!lastName && alert ? Boolean(true) : Boolean(false)}
                  helperText={!lastName && alert ? 'Last Name is required' : ''}
                />
              </>
            ) : (
              <Autocomplete
                options={members?.map((option) => ({
                  memberId: option?._id,
                  name: option?.name,
                  phone: option?.phone,
                  point: option?.point,
                }))}
                getOptionLabel={(option) => option?.name || option}
                isOptionEqualToValue={(option, value) => option?.phone === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Name"
                    variant="outlined"
                    onChange={onInputSearch}
                    error={!fullName && alert ? Boolean(true) : Boolean(false)}
                    helperText={!fullName && alert ? 'Customer Name is required' : ''}
                  />
                )}
                fullWidth
                autoComplete
                loading={loading}
                onChange={handleChange}
                value={fullName || null}
                // freeSolo
              />
            )}
            <div>
              <CustomSwitch name="newMember" label="New" checked={isNew} onChange={() => handleSwitch()} />
            </div>
          </Stack>
          <Stack flexDirection="row" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                label="Order Date"
                inputFormat="dd/MM/yyyy HH:mm"
                ampm={false}
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
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
                    sx={{ width: 400 }}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              name="customerPhone"
              label="WA Number"
              fullWidth
              autoComplete="off"
              // value={phone}
              value={!isNew ? (!phone?.includes('EM') ? maskedPhone(['owner', 'super admin']?.includes(user?.role), phone) : '-') : phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              error={!phone && alert ? Boolean(true) : Boolean(false)}
              helperText={!phone && alert ? 'Phone is required' : ''}
              disabled={isNew ? Boolean(false) : Boolean(true)}
            />
            <Stack justifyContent="center">
              <Button variant="contained" onClick={() => handleSubmit()}>
                Save
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      {/* <DialogActions sx={{ justifyContent: "center" }}>
                <Button variant="outlined" onClick={() => handleCancel()}>
                    Cancel
                </Button>
            </DialogActions> */}
    </BootstrapDialog>
  );
}
