import React, { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

// MUI
import {
  Alert,
  Button,
  styled,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

// react-select
import AsyncSelect from 'react-select/async';

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
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && (
        <IconButton
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
      )}
    </DialogTitle>
  );
};

export default function ModalInputCustomer(props) {
  const { user } = useAuth();
  const ctx = useContext(cashierContext);
  const theme = useTheme();

  const [date, setDate] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [defaultMembers, setDefaultMembers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [point, setPoint] = useState(0);

  useEffect(() => {
    const fetchDefault = async () => {
      const res = await axios.get('/member?perPage=30&status=active');

      setDefaultMembers(
        res.data.docs.map((item) => ({
          value: item._id,
          label: item.name,
          phone: item.phone,
          point: item.point,
        }))
      );
    };

    fetchDefault();
  }, []);

  // =========================
  // LOAD OPTIONS (API)
  // =========================
  const loadOptions = async (inputValue) => {
    try {
      const res = await axios.get('/member', {
        params: {
          search: inputValue || '',
          status: 'active',
          perPage: 30,
        },
      });

      return (res?.data?.docs || []).map((item) => ({
        value: item._id,
        label: item.name,
        phone: item.phone,
        point: item.point,
      }));
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  };

  // debounce biar gak spam API
  const debouncedLoadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    []
  );

  // =========================
  // EFFECT OPEN MODAL
  // =========================
  useEffect(() => {
    if (props.open) {
      setDate(ctx.customerName ? ctx.orderDate : new Date());
      setFullName(ctx.customerName || '');
      setPhone(ctx.customerPhone || '');
      setPoint(ctx.customerPoint || 0);
    }
  }, [props.open]);

  // =========================
  // HANDLERS
  // =========================
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
    }, 300);
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

  // =========================
  // RENDER
  // =========================
  return (
    <BootstrapDialog fullWidth maxWidth="sm" open={props.open}>
      <BootstrapDialogTitle onClose={handleCancel}>
        Input Customer
      </BootstrapDialogTitle>

      <DialogContent dividers>
        <Stack gap={2}>

          {isNew && (
            <Alert severity="warning">
              Jika <b>No. WA</b> belum ada, bisa diisi <b>62</b>
            </Alert>
          )}

          <Stack direction="row" gap={2} alignItems="center">
            {isNew ? (
              <>
                <TextField
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!firstName && alert}
                  helperText={!firstName && alert && 'First Name is required'}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!lastName && alert}
                  helperText={!lastName && alert && 'Last Name is required'}
                />
              </>
            ) : (
              <div style={{ width: '100%', position: 'relative' }}>
                {/* 🔥 Floating Label */}
                <span
                  id="customer-name-select"
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: isFocused || fullName ? -8 : 18,
                    fontSize: isFocused || fullName ? 12 : 16,
                    color: isFocused
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.paper,
                    padding: isFocused || fullName ? '0 4px' : '0',
                    transition: 'all 0.15s ease',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  Customer Name
                </span>

                <AsyncSelect
                  aria-labelledby="customer-name-select"
                  cacheOptions
                  defaultOptions={defaultMembers}
                  loadOptions={debouncedLoadOptions}
                  value={
                    fullName
                      ? {
                        label: fullName,
                        value: fullName,
                        phone,
                        point,
                      }
                      : null
                  }
                  onChange={(val) => {
                    setFullName(val ? val.label : '');
                    setPhone(val ? val.phone : '');
                    setPoint(val ? val.point : 0);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="" // kosongkan biar ga tabrakan label
                  isClearable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  styles={{
                    control: (base, state) => {
                      const isError = !fullName && alert;
                      const isActive = state.isFocused;

                      return {
                        ...base,
                        minHeight: 56,
                        borderRadius: 8,
                        border: `1px solid ${isError
                          ? theme.palette.error.main
                          : isActive
                            ? theme.palette.primary.main
                            : theme.palette.grey[400]
                          }`,
                        boxShadow: isActive
                          ? `0 0 0 1px ${theme.palette.primary.main}`
                          : 'none',
                        '&:hover': {
                          borderColor: isError
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        },
                        backgroundColor: theme.palette.background.paper,
                      };
                    },

                    menu: (base) => ({
                      ...base,
                      backgroundColor: theme.palette.background.paper,
                      zIndex: 9999,
                    }),

                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? theme.palette.action.hover
                        : theme.palette.background.paper,
                    }),
                  }}
                />

                {!fullName && alert && (
                  <span style={{ color: 'red', fontSize: 12 }}>
                    Customer Name is required
                  </span>
                )}
              </div>
            )}

            <CustomSwitch
              label="New"
              checked={isNew}
              onChange={handleSwitch}
            />
          </Stack>

          <Stack direction="row" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                label="Order Date"
                inputFormat="dd/MM/yyyy HH:mm"
                ampm={false}
                value={date}
                onChange={setDate}
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
              label="WA Number"
              fullWidth
              value={
                !isNew
                  ? !phone?.includes('EM')
                    ? maskedPhone(['owner', 'super admin'].includes(user?.role), phone)
                    : '-'
                  : phone
              }
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ''))
              }
              error={!phone && alert}
              helperText={!phone && alert && 'Phone is required'}
              disabled={!isNew}
            />

            <Stack justifyContent="center">
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </Stack>
          </Stack>

        </Stack>
      </DialogContent>
    </BootstrapDialog>
  );
}