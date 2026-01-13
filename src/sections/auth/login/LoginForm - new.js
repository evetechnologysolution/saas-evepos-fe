import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Stack, Alert, IconButton, Button, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
//
import ButtonBox from './ButtonBox';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();

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
    clearErrors,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const btnValues = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['Clear', 0, 'Del'],
  ];

  const numClickHandler = (e) => {
    const value = getValues('password') + e.target.value;
    setValue('password', value);
    clearErrors('password');
  };

  const resetClickHandler = (e) => {
    if (e.target.value === 'Del' && getValues('password').toString().length > 1) {
      const value = getValues('password').toString().slice(0, -1);
      setValue('password', value);
    } else {
      setValue('password', '');
    }
  };

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
    } catch (error) {
      // console.error(error);

      setValue('password', '');

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Login to Dashboard asdasd
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              </Box>

              <Image
                disabledEffect
                src={`https://minimal-assets-api-dev.vercel.app/assets/icons/auth/ic_jwt.png`}
                sx={{ width: 32, height: 32 }}
              />
            </Stack>

            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <RHFTextField name="username" label="Username" type="text" autoComplete="off" />

            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              // disabled
              pattern="[0-9]*"
              inputMode="numeric"
              onKeyUp={(e) => setValue('password', e.target.value.replace(/[^0-9]/g, ''))}
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
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={3}>
            <ButtonBox>
              {btnValues.flat().map((btn, i) => (
                <Button
                  key={i}
                  onClick={btn === 'Clear' || btn === 'Del' ? resetClickHandler : numClickHandler}
                  sx={{ height: '4.5rem', fontSize: 'calc(0.5vw + 12px)' }}
                  variant="outlined"
                  value={btn}
                >
                  {btn}
                </Button>
              ))}
            </ButtonBox>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Login
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
