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
import { Link, useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import schema from './schema';
//

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    schema: schema.getDefault(),
  });

  const {
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const liveFormState = watch();

  const onSubmit = async (data) => {
    try {
      const { username, password, whatsapp, email } = data;
      const response = await register({
        username,
        password,
        phone: whatsapp,
        email,
        // baseUrl: 'http://localhost:3060/',
      });
      navigate(`/auth/konfirmasi?email=${response.email}`);
    } catch (error) {
      setValue('password', '');
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth={true}>
      <Stack spacing={3} sx={{ width: '100%' }}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" type="email" autoComplete="off" />
        <RHFTextField name="username" label="Username" type="text" autoComplete="off" />
        <RHFTextField name="whatsapp" label="No. WhatsApp" placeholder="628xxxxxxxx" type="text" autoComplete="off" />

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

        <Link to="/auth/register" style={{ textDecoration: 'none' }}>
          <Typography variant="body1" color="black" sx={{ display: 'inline-flex', gap: 0.5 }}>
            Punya Kode Referal ?
            <Typography component="span" fontWeight={600} sx={{ color: '#5274D9' }}>
              Gunakan
            </Typography>
          </Typography>
        </Link>

        <FormControlLabel
          control={<RHFCheckbox name="agree" />}
          label={
            <Typography variant="body2">
              Saya setuju dengan{' '}
              <Typography component="span" sx={{ color: '#5274D9', cursor: 'pointer' }}>
                syarat dan ketentuan
              </Typography>
            </Typography>
          }
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!liveFormState.agree}
        >
          Daftar
        </LoadingButton>

        <Box display="flex" justifyContent="center">
          <Link to="/auth/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body1" color="black" sx={{ display: 'inline-flex', gap: 0.5 }}>
              Sudah Punya Akun ?
              <Typography component="span" fontWeight={600} sx={{ color: '#5274D9' }}>
                Masuk
              </Typography>
            </Typography>
          </Link>
        </Box>
      </Stack>
    </FormProvider>
  );
}
