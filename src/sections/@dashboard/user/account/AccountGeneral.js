/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { mainContext } from 'src/contexts/MainContext';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Button, InputAdornment, IconButton, Avatar } from '@mui/material';
import Modal from '@mui/material/Modal';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
// _mock
import { province } from '../../../../_mock';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import defaultAvatar from '../../../../assets/avatar_default.jpg';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();
  const ctx = useContext(mainContext);

  const UpdateUserSchema = Yup.object().shape({
    fullname: Yup.string().required('Full Name is required'),
    email: Yup.string().email().required('Email is required'),
    username: Yup.string().required('Username is required'),
    phone: Yup.string()
      .matches(/^\d+$/, 'Number only!')
      .min(10, 'Minimum 10 digit numbers')
      .max(15, 'Maximum 15 digit numbers')
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
  });

  const UpdatePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    fullname: user?.fullname || '',
    email: user?.email || '',
    address: user?.address || '',
    username: user?.username || '',
    phone: user?.phone || '',
    businessName: ctx?.businessInformation.name || '',
    businessAddress: ctx?.businessInformation.address || '',
    city: ctx?.businessInformation.city || '',
    province: ctx?.businessInformation.province || '',
    region: ctx?.businessInformation.region || '',
    zipCode: ctx?.businessInformation.zipCode || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const updatePasswordMethods = useForm({
    resolver: yupResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmNewPassword: '',
    },
  });

  const {
    handleSubmit: handleSubmitPassword,
    formState: { isSubmitting: isSubmittingPassword },
    reset: resetPassword,
    setError,
  } = updatePasswordMethods;

  const onSubmit = async (data) => {
    const { fullname, username, email, phone, address } = data;
    const generalInformation = { fullname, username, email, phone, address };
    const businessInformation = {
      name: data.businessName,
      address: data.businessAddress,
      city: data.city,
      province: data.province,
      region: data.region,
      zipCode: data.zipCode,
    };
    try {
      await ctx.updatePersonalInformation(generalInformation, user._id);
      if (user.role === 'Super Admin') {
        await ctx.updateBusinessInformation(businessInformation);
      }
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const onSubmitPass = async (data) => {
    const { oldPassword, password } = data;
    const obj = { oldPassword, password };
    try {
      const res = await ctx.updatePassword(obj, user._id);
      if (res.response?.data?.message === 'Old password incorrect') {
        setError('oldPassword', {
          message: 'Wrong old password!',
        });
      } else {
        enqueueSnackbar('Update success!');
        setChangePassword(false);
        resetPassword();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     if (file) {
  //       setValue(
  //         'photoURL',
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file),
  //         })
  //       );
  //     }
  //   },
  //   [setValue]
  // );

  return (
    <Box>
      <FormProvider key={1} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              {/* <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            /> */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  sx={{ bgcolor: 'gray', color: 'white', width: 128, height: 128 }}
                  // src="https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_5.jpg"
                  src={defaultAvatar}
                  alt="Avatar"
                />
              </Box>
              <Button sx={{ marginTop: 2 }} onClick={() => setChangePassword(true)}>
                Change Password
              </Button>
              {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} /> */}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ paddingBottom: '1rem' }}>
                Personal Informations
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="fullname" label="Full Name" />
                  <RHFTextField name="username" label="Username" />
                  <RHFTextField name="phone" label="Phone Number" />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="email" label="Email Address" />
                  <RHFTextField name="address" label="Address" multiline rows={5} />
                </Box>

                {/* <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" /> */}
              </Box>
              {user.role !== 'Super Admin' ? (
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 6 }}>
                  {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                  </LoadingButton>
                </Stack>
              ) : null}
              {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack> */}
            </Card>
            {user.role === 'Super Admin' ? (
              <Card sx={{ p: 3, marginTop: '2rem' }}>
                <Typography variant="h4" sx={{ paddingBottom: '1rem' }}>
                  Business Informations
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    rowGap: 3,
                    columnGap: 2,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                    <RHFTextField name="businessName" label="Business Name" />
                    <RHFTextField name="businessAddress" label="Business Address" />
                    <RHFSelect name="province" label="Province" placeholder="Province">
                      <option />
                      {province.map((option, index) => (
                        <option key={index} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Box>
                  <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                    <RHFTextField name="city" label="City" />

                    <RHFTextField name="region" label="Region" />

                    <RHFTextField name="zipCode" label="Zip/Code" />
                  </Box>
                </Box>

                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 6 }}>
                  {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
                  </LoadingButton>
                </Stack>
              </Card>
            ) : null}
          </Grid>
        </Grid>
      </FormProvider>
      <Modal open={changePassword} onClose={() => setChangePassword(false)}>
        <Box
          sx={{ height: '100vh' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <Card sx={{ p: 3, width: '40%' }}>
            <FormProvider key={2} methods={updatePasswordMethods} onSubmit={handleSubmitPassword(onSubmitPass)}>
              <Stack spacing={3} alignItems="flex-end">
                <RHFTextField
                  name="oldPassword"
                  type={showPassword ? 'text' : 'password'}
                  label="Old Password"
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
                  name="password"
                  type={showPasswordNew ? 'text' : 'password'}
                  label="New Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordNew(!showPasswordNew)} edge="end">
                          <Iconify icon={showPasswordNew ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <RHFTextField
                  name="confirmNewPassword"
                  type={showPasswordNew ? 'text' : 'password'}
                  label="Confirm New Password"
                />

                <Box>
                  <Button onClick={() => setChangePassword(false)} sx={{ marginRight: 3 }}>
                    Cancel
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmittingPassword}>
                    Save Changes
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}
