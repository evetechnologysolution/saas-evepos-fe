/* eslint-disable import/order */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Button,
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Typography,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3),
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

export default function ModalSubscriptionExpired() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (user?.tenantRef?.subsRef?.endDate) {
      const endDate = new Date(user.tenantRef.subsRef.endDate);
      const today = new Date();
      const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      setDaysRemaining(diffInDays);

      // Auto open modal hanya jika subscription sudah expired (hari H atau sudah lewat)
      if (diffInDays <= 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [user]);

  const formatDate = (date) => {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('id-ID', options);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRenew = () => {
    // Tambahkan logika untuk perpanjang subscription
    // Misalnya redirect ke halaman pembayaran atau buka modal pembayaran
    window.location.href = '/dashboard/subscription';
    setOpen(false);
  };

  const endDate = user?.tenantRef?.subsRef?.endDate;

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      fullWidth
      maxWidth="sm"
      open={open}
      className="subscription-modal"
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        style={{ borderBottom: '1px solid #ccc' }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Iconify icon="eva:alert-triangle-fill" width={24} height={24} color="error.main" />
          <Typography variant="h6" textTransform="capitalize">
            {user?.tenantRef?.subsRef?.status} Berakhir
          </Typography>
        </Box>
      </BootstrapDialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={2}>
          {/* Icon Besar */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'error.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="eva:clock-outline" width={48} height={48} color="error.main" />
          </Box>

          {/* Alert */}
          <Alert severity="error" variant="outlined" sx={{ width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Paket kamu telah berakhir pada {formatDate(endDate)}
            </Typography>
            <Typography variant="body2">Segera perpanjang untuk melanjutkan menggunakan layanan.</Typography>
          </Alert>

          {/* Informasi Tambahan */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Dengan memperpanjang subscription, Anda akan mendapatkan:
            </Typography>
            <Box display="flex" flexDirection="column" gap={1} alignItems="flex-start">
              <Box display="flex" alignItems="center" gap={1}>
                <Iconify icon="eva:checkmark-circle-2-fill" width={20} height={20} color="success.main" />
                <Typography variant="body2">Akses penuh ke semua fitur</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Iconify icon="eva:checkmark-circle-2-fill" width={20} height={20} color="success.main" />
                <Typography variant="body2">Support prioritas 24/7</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Iconify icon="eva:checkmark-circle-2-fill" width={20} height={20} color="success.main" />
                <Typography variant="body2">Update fitur terbaru</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3 }}>
        <Button
          variant="contained"
          onClick={handleRenew}
          color="error"
          size="large"
          startIcon={<Iconify icon="eva:refresh-fill" />}
        >
          Perpanjang Sekarang
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
