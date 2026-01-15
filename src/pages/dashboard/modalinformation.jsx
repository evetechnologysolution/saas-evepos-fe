/* eslint-disable camelcase */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, forwardRef, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  ListItemText,
  MenuItem,
  Slide,
  Stack,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { StorefrontOutlined, TrendingUpOutlined, Inventory2Outlined, AnalyticsOutlined } from '@mui/icons-material';
import useAuth from 'src/hooks/useAuth';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFSelectMultiple, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import { product_category, customer_needed } from './mock';
import schema from './schema';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AlertNewUser() {
  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  useEffect(() => {
    if (!auth?.user?.tenantRef?.hasSurvey) {
      setOpen(true);
    }
  }, [auth]);

  const methods = useForm({
    resolver: yupResolver(schema),
    schema: schema.getDefault(),
    defaultValues: schema.getDefault(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const usedOtherAppBefore = watch('hasUsed');

  const onSubmit = async (data) => {
    await handleMutationFeedback(axios.post('/survey', data), {
      successMsg: 'Berhasil! Dashboard akan diatur sesuai preferensimu.',
      errorMsg: 'Gagal menyimpan data!',
      onSuccess: () => closeDialog(),
      enqueueSnackbar,
    });
  };

  const features = [
    {
      icon: <StorefrontOutlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Point of Sale',
      description: 'Sistem kasir modern dan mudah',
    },
    {
      icon: <TrendingUpOutlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Analytics',
      description: 'Analisa bisnis real-time',
    },
    {
      icon: <Inventory2Outlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Inventory',
      description: 'Kelola stok dengan mudah',
    },
    {
      icon: <AnalyticsOutlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Reporting',
      description: 'Laporan lengkap dan detail',
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <Grid container>
          {/* Left Side - Illustration */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              color: 'white',
              position: 'relative',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4, zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Selamat Datang! 🎉
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                Mari kita personalisasi pengalaman Anda
              </Typography>
            </Box>

            {/* Feature Cards */}
            <Stack spacing={2} sx={{ width: '100%', zIndex: 1 }}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="white">
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }} color="white">
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>

            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0,
              }}
            />
          </Grid>

          {/* Right Side - Form */}
          <Grid item xs={12} md={7}>
            <DialogTitle variant="h5" sx={{ pb: 1, pt: 3 }}>
              Selamat datang di Evepos, {auth.user?.username}! 👋
            </DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description" sx={{ mb: 3 }}>
                Lengkapi pertanyaan di bawah ini untuk personalisasi dashboard Anda
              </DialogContentText>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth>
                <Stack spacing={2.5}>
                  <FormControl>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Apakah Anda memiliki bisnis online?
                    </Typography>
                    <RHFRadioGroup
                      name="hasOnlineBusiness"
                      options={[
                        { value: true, label: 'Ya' },
                        { value: false, label: 'Tidak' },
                      ]}
                    />
                  </FormControl>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Apa jenis produk Anda?
                    </Typography>
                    <RHFSelect name="productType" label="Pilih" SelectProps={{ native: false }}>
                      {product_category.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          {result.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Apa yang Anda butuhkan di Evepos?
                    </Typography>
                    <RHFSelectMultiple
                      name="requiredFeatures"
                      label="Pilih"
                      placeholder="Pilih kebutuhan Anda"
                      options={customer_needed}
                    >
                      {customer_needed.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          <Checkbox checked={methods.watch('needs')?.indexOf(result.value) > -1} size="small" />
                          <ListItemText primary={result.name} />
                        </MenuItem>
                      ))}
                    </RHFSelectMultiple>
                  </Box>

                  <FormControl>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Apakah Anda pernah menggunakan aplikasi lain sebelumnya?
                    </Typography>
                    <RHFRadioGroup
                      name="hasUsed"
                      options={[
                        { value: true, label: 'Ya' },
                        { value: false, label: 'Tidak' },
                      ]}
                    />
                  </FormControl>

                  {usedOtherAppBefore === 'true' && (
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Nama aplikasi
                      </Typography>
                      <RHFTextField
                        name="otherAppName"
                        label="Nama aplikasi"
                        placeholder="contoh: iReap, Pawoon, dll"
                      />
                    </Box>
                  )}

                  <FormControl>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Dari manakah Anda mengetahui Evepos?
                    </Typography>
                    <RHFRadioGroup
                      name="source"
                      options={[
                        { value: 'google', label: 'Google' },
                        { value: 'referral', label: 'Rekan/Partner Bisnis' },
                        { value: 'other', label: 'Lainnya' },
                      ]}
                    />
                  </FormControl>
                </Stack>

                <Box sx={{ marginTop: '1.5em' }}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Simpan & Mulai
                  </LoadingButton>
                </Box>
              </FormProvider>
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}
