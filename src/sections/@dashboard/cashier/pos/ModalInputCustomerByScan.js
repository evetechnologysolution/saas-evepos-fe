import React, { useState, useContext, useEffect, useRef } from 'react';
// zxing
import { BrowserMultiFormatReader } from '@zxing/library';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
// @mui
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
  Typography,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import axios from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
import Iconify from '../../../../components/Iconify';
import { maskedPhone } from '../../../../utils/masked';
// context
import { cashierContext } from '../../../../contexts/CashierContext';

// ----------------------------------------------------------------------

ModalScanCustomer.propTypes = {
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

export default function ModalScanCustomer(props) {
  const { user } = useAuth();
  const ctx = useContext(cashierContext);

  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [point, setPoint] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // State untuk menampilkan kamera
  const [intervalId, setIntervalId] = useState(null);
  const webcamRef = useRef(null);
  const codeReaderRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (props.open) {
      setDate(new Date());
    }
  }, [props.open]);

  const handleScanSuccess = (text) => {
    if (text) {
      setMemberId(text); // Set hasil scan ke memberId
      if (inputRef.current) {
        // Fokus ke input field
        inputRef.current.focus();

        // Trigger event keydown Enter secara programatik
        setTimeout(() => {
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          inputRef.current.dispatchEvent(enterEvent);
        }, 100); // Delay untuk memastikan memberId sudah diset dan fokusnya sudah aktif
      }
    }
    handleCloseCamera();
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);

    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    codeReaderRef.current = new BrowserMultiFormatReader();

    // Ambil frame tiap 500ms dan decode
    const id = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const result = await codeReaderRef.current.decodeFromImageUrl(imageSrc);
          if (result) {
            handleScanSuccess(result.getText());
          }
        } catch (err) {
          // ignore decode errors (artinya belum ketemu QR)
        }
      }
    }, 500);

    setIntervalId(id);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);

    // Hentikan ZXing
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.warn('ZXing reset error:', err);
      }
    }

    // Stop interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    // Handle back navigation (browser back button or device back button)
    const handleBackAction = () => {
      if (isCameraOpen) {
        handleCloseCamera();
      }
    };

    // Add event listener for browser back action
    window.addEventListener('popstate', handleBackAction);

    // Manipulasi riwayat secara manual saat membuka kamera
    if (isCameraOpen) {
      window.history.pushState(null, null, window.location.href);
    }

    // Cleanup when the component unmounts or camera is closed
    return () => {
      window.removeEventListener('popstate', handleBackAction);
      if (isCameraOpen) {
        handleCloseCamera(); // Ensure camera is closed when leaving the modal
      }
    };
  }, [isCameraOpen]);

  const handleSearch = async () => {
    if (memberId) {
      setLoading(true);
      try {
        const res = await axios.get(`/member/track?search=${memberId}`);
        if (res?.data) {
          setNotFound(false);
          setNotVerified(!res?.data?.isVerified);
          setName(res?.data?.isVerified ? res?.data?.name : '');
          setPhone(res?.data?.isVerified ? res?.data?.phone : '');
          setPoint(res?.data?.isVerified ? res?.data?.point : 0);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setNotFound(true);
        setName('');
        setPhone('');
        setPoint(0);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    props.onClose();
    setTimeout(() => {
      setDate(new Date());
      setMemberId('');
      setName('');
      setPhone('');
      setPoint(0);
      setAlert(false);
      setNotFound(false);
      setNotVerified(false);
    }, 100);
  };

  const handleCancel = () => {
    ctx.setCustomerScan(false);
    if (!ctx.customerName) {
      ctx.setOrderType('onsite');
    }
    handleReset();
  };

  const handleSubmit = () => {
    if (name !== '' && phone !== '') {
      ctx.setOrderDate(date);
      ctx.setCustomerName(name);
      ctx.setCustomerPhone(phone);
      ctx.setCustomerPoint(point);
      ctx.setCustomerScan(true);
      setAlert(false);
      handleReset();
    } else {
      setAlert(true);
    }
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
          <Stack flexDirection="row" alignItems="center" gap={2}>
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
              ref={inputRef}
              name="memberId"
              label="Member ID"
              fullWidth
              autoComplete="off"
              autoFocus
              value={memberId}
              // onChange={(e) => setMemberId(e.target.value.toUpperCase())}
              onChange={(e) => {
                const newValue = e.target.value.toUpperCase();
                if (newValue.length <= 16) {
                  setMemberId(newValue);
                } else {
                  setMemberId(newValue.slice(-16)); // Ambil 16 karakter terakhir (untuk replace otomatis)
                }
              }}
              onKeyDown={handleOnKeyPress}
              InputProps={{
                inputProps: { maxLength: 16 },
              }}
            />
            {/* <LoadingButton variant="contained" loading={loading} onClick={() => handleSearch()}>
                            <Iconify icon="eva:search-fill" width={30} height={30} />
                        </LoadingButton> */}
            <LoadingButton variant="contained" loading={loading} onClick={() => handleOpenCamera()}>
              <Iconify icon="solar:camera-bold" width={30} height={30} />
            </LoadingButton>
          </Stack>
          {notFound && <Alert severity="warning">Data member tidak ditemukan</Alert>}
          {notVerified && (
            <Alert severity="error">
              Belum terdaftar sebagai member, silakan register di <b>evewash.com</b>.
            </Alert>
          )}
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <TextField
              name="customerName"
              label="Customer Name"
              fullWidth
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!name && alert ? Boolean(true) : Boolean(false)}
              helperText={!name && alert ? 'Customer Name is required' : ''}
              disabled
            />
            <TextField
              name="customerPhone"
              label="WA Number"
              fullWidth
              autoComplete="off"
              value={!phone?.includes('EM') ? maskedPhone(user?.role === 'Super Admin', phone) : '-'}
              error={!phone && alert ? Boolean(true) : Boolean(false)}
              helperText={!phone && alert ? 'Phone is required' : ''}
              disabled
            />
            <Button variant="contained" onClick={() => handleSubmit()}>
              Save
            </Button>
          </Stack>
        </Stack>
      </DialogContent>

      {/* Modal Kamera Full Screen */}
      {isCameraOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Kamera pakai react-webcam */}
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <IconButton
            onClick={() => handleCloseCamera()}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            }}
          >
            <Iconify icon="eva:close-fill" width={30} height={30} />
          </IconButton>
          <Stack
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={4}
            p={1}
            sx={{ position: 'absolute', inset: 0 }}
          >
            <div style={{ position: 'relative', width: '50vw', height: '50vh' }}>
              {['top left', 'top right', 'bottom left', 'bottom right'].map((pos, i) => {
                let bgColor = '#FFFFFF transparent transparent #FFFFFF';
                if (i === 1) bgColor = '#FFFFFF #FFFFFF transparent transparent';
                if (i === 2) bgColor = 'transparent transparent #FFFFFF #FFFFFF';
                if (i === 3) bgColor = 'transparent #FFFFFF #FFFFFF transparent';
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      [pos.split(' ')[0]]: 0,
                      [pos.split(' ')[1]]: 0,
                      width: '2rem',
                      height: '2rem',
                      border: '4px solid transparent',
                      borderColor: bgColor,
                    }}
                  />
                );
              })}

              {/* Animasi scan */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    position: 'absolute',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    position: 'absolute',
                    animation: 'scanMove 2s linear infinite',
                    boxShadow: '0px 0px 10px #FFFFFF',
                  }}
                />
              </div>

              {/* CSS Animasi */}
              <style>
                {`
                                    @keyframes scanMove {
                                        0% { top: 0; opacity: 0.1; }
                                        50% { opacity: 1; }
                                        100% { top: 100%; opacity: 0.1; }
                                    }
                                `}
              </style>
            </div>
            <Typography variant="body" color="#FFFFFF" textAlign="center">
              Sejajarkan kode QR di dalam kotak untuk pemindai otomatis
            </Typography>
          </Stack>
        </div>
      )}
    </BootstrapDialog>
  );
}
