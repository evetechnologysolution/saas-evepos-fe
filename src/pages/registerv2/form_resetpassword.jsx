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
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import schema from './schema/resetpassword';
//

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const methods = useForm({
    resolver: yupResolver(schema),
    schema: schema.getDefault(),
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [query] = useSearchParams();

  const token = query.get('token');

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    try {
      const { password } = data;
      await axios.post('/auth/change-password', {
        password,
        token,
      });
      enqueueSnackbar('Password berhasil diperbarui. Silakan login dengan password baru Anda.', {
        variant: 'success',
        autoHideDuration: 8000,
      });
      navigate('/auth/login');
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

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Konfirmasi Password"
          type={showConfirm ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  <Iconify icon={showConfirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Simpan
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
