/* eslint-disable react/jsx-boolean-value */
import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Typography, Box, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import schema from './schema/forgotpassword';
//

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const methods = useForm({
    resolver: yupResolver(schema),
    schema: schema.getDefault(),
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.post('/auth/forgot-password', data);
      enqueueSnackbar('Tautan reset password telah dikirim ke email Anda. Silakan cek inbox/spam.', {
        variant: 'success',
        autoHideDuration: 8000,
      });
    } catch (err) {
      if (err.message) {
        const msg = err?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.';

        enqueueSnackbar(msg, { variant: 'error' });
      } else if (err.request) {
        enqueueSnackbar('Koneksi gagal. Periksa internet Anda.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Error tidak dikenal terjadi.', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth={true}>
      <Stack spacing={3} sx={{ width: '100%' }}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" type="email" autoComplete="off" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
