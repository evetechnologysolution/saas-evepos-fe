/* eslint-disable react/jsx-boolean-value */
import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
//

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // await login(data.username, data.password);
      const response = await login({ username: data.username, password: data.password });
      if (response?.tenantRef?.status === 'pending') {
        navigate('/auth/informasi-usaha');
      } else {
        navigate('/dashboard/app');
      }
    } catch (error) {
      // console.error(error);

      setValue('password', '');

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth={true}>
      <Stack spacing={3} sx={{ width: '100%' }} color="red">
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="username" label="Username" type="text" autoComplete="off" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          // disabled
          // pattern="[0-9]*"
          // inputMode="numeric"
          onChange={(e) => setValue('password', e.target.value)}
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

        <Link to="/#" style={{ textDecoration: 'none' }}>
          <Typography variant="body1" fontWeight={600} color="#5274D9">
            Lupa kata sandi?
          </Typography>
        </Link>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>

        <Box display="flex" justifyContent="center">
          <Link to="/auth/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body1" color="black" sx={{ display: 'inline-flex', gap: 0.5 }}>
              Baru di Evepos ?
              <Typography component="span" fontWeight={600} sx={{ color: '#5274D9' }}>
                Daftar
              </Typography>
            </Typography>
          </Link>
        </Box>
      </Stack>
    </FormProvider>
  );
}
