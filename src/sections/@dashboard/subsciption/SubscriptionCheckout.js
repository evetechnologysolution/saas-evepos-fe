import React, { useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Button, Box, Card, Divider, Grid, Typography, Stack, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { formatDate } from '../../../utils/getData';
import { handleMutationFeedback } from '../../../utils/mutationfeedback';
// context
import { mainContext } from '../../../contexts/MainContext';
// hooks
import useAuth from '../../../hooks/useAuth';
import useService from './service/useService';

// ----------------------------------------------------------------------

const shadow = '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)';

export default function SubscriptionCheckout() {
  const { user } = useAuth();
  const { create } = useService();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ctx = useContext(mainContext);

  const adminFee = 10000;
  const price = ctx.selectedSubs?.price ?? 0;
  const qty = ctx.selectedSubs?.qty ?? 1;
  const discount = ctx.selectedSubs?.discount ?? 0;
  const subPrice = price * qty;
  const subsType = ctx.selectedSubs?.subsType;

  let daysToAdd = 0;

  if (subsType === 'monthly') {
    daysToAdd = qty * 30;
  } else if (subsType === 'yearly') {
    daysToAdd = qty * 365;
  }

  const today = new Date();
  const expired = new Date(today);
  expired.setDate(expired.getDate() + daysToAdd);

  const discountAmount = useMemo(() => {
    return (discount / 100) * subPrice;
  }, [subPrice, discount]);

  const tax = useMemo(() => {
    return (subPrice - discountAmount + adminFee) * 0.11;
  }, [subPrice, discountAmount]);

  const billedAmount = useMemo(() => {
    return subPrice - discountAmount + adminFee + tax;
  }, [subPrice, discountAmount, tax]);

  useEffect(() => {
    if (!ctx.selectedSubs?.origin) return;

    ctx.setSelectedSubs((prev) => {
      if (!prev?.origin) return prev;

      return {
        ...prev,
        price: prev.subsType === 'monthly' ? prev.origin?.price?.monthly : prev.origin?.price?.yearly,
        discount: prev.subsType === 'monthly' ? prev.origin?.discount?.monthly : prev.origin?.discount?.yearly,
      };
    });
  }, [ctx.selectedSubs?.subsType]);

  useEffect(() => {
    if (!ctx.selectedSubs?._id) {
      navigate('/dashboard/subscription');
    }
  }, [ctx.selectedSubs?._id]);

  const handleMinus = () => {
    ctx.setSelectedSubs((prev) => {
      if (!prev) return prev;
      if (prev.qty <= 1) return prev;

      return { ...prev, qty: prev.qty - 1 };
    });
  };

  const handlePlus = () => {
    ctx.setSelectedSubs((prev) => {
      if (!prev) return prev;
      return { ...prev, qty: (prev.qty ?? 1) + 1 };
    });
  };

  const handleCheckout = async () => {
    if (!user?.tenantRef?._id) return;

    const { origin, _id, name, ...other } = ctx.selectedSubs;

    const payload = {
      ...other,
      tenantRef: user?.tenantRef?._id,
      subsRef: user?.tenantRef?.subsRef?._id,
      serviceRef: _id,
      serviceName: name,
      startDate: today,
      endDate: expired,
      discount,
      adminFee,
      tax,
      billedAmount,
      customer: {
        name: user?.tenantRef?.ownerName,
        email: user?.tenantRef?.email || user?.email || '',
        phone: user?.tenantRef?.phone || user?.phone || '',
      },
      baseUrl: window.location.origin,
    };

    const mutation = create.mutateAsync(payload);

    await handleMutationFeedback(mutation, {
      successMsg: 'Data berhasil dibuat!',
      errorMsg: 'Gagal menyimpan data!',
      onSuccess: (res) => {
        // navigate(`/dashboard/invoice/${res?._id}/detail`);
        navigate('/dashboard/subscription');
        // Jika ada invoiceUrl, buka di tab baru
        if (res?.invoiceUrl) {
          window.open(res.invoiceUrl, '_blank', 'noopener,noreferrer');
        }
      },
      enqueueSnackbar,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              boxShadow: shadow,
            }}
          >
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Button variant="outlined" onClick={() => navigate('/dashboard/subscription')}>
                Back
              </Button>
              <Select
                value={ctx.selectedSubs?.subsType}
                onChange={(e) => {
                  ctx.setSelectedSubs({ ...ctx.selectedSubs, subsType: e.target.value });
                }}
                sx={{
                  height: '40px',
                }}
              >
                <MenuItem value="monthly">Termin Langganan Bulanan</MenuItem>
                <MenuItem value="yearly">Termin Langganan Tahunan</MenuItem>
              </Select>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="subtitle2">Produk</Typography>
                  <Typography variant="body2">{ctx.selectedSubs?.name || '-'}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="subtitle2">Status Langganan</Typography>
                  <Typography variant="body2">Aktif dari : {formatDate(today)}</Typography>
                  <Typography variant="body2">Berakhir pada : {formatDate(expired)}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="subtitle2">Durasi</Typography>
                  <Stack flexDirection="row" alignItems="center" gap={4}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '25px', height: '25px' }}
                      onClick={handleMinus}
                    >
                      <Iconify icon="typcn:minus" />
                    </Button>
                    <Typography variant="body2">{ctx.selectedSubs?.qty || 1}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '25px', height: '25px' }}
                      onClick={handlePlus}
                    >
                      <Iconify icon="typcn:plus" />
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="subtitle2">Harga</Typography>
                  <Typography variant="body2">{`${fCurrency(
                    (ctx.selectedSubs?.qty || 1) * (ctx.selectedSubs?.price || 0)
                  )}`}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              boxShadow: shadow,
            }}
          >
            <Typography variant="h6">Rincian</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack flexDirection="column" gap={1}>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Biaya Langganan</Typography>
                <Typography variant="subtitle2">{fCurrency(subPrice)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Diskon</Typography>
                <Typography variant="subtitle2">{fCurrency(discountAmount)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Biaya Admin</Typography>
                <Typography variant="subtitle2">{fCurrency(adminFee)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">PPN 11%</Typography>
                <Typography variant="subtitle2">{fCurrency(tax)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="subtitle1" color="primary">
                  Total
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {fCurrency(billedAmount)}
                </Typography>
              </Stack>
              <LoadingButton variant="contained" onClick={() => handleCheckout()} loading={create.isLoading}>
                CHECKOUT
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
