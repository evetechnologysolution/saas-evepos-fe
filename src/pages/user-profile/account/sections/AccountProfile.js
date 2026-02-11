/* eslint-disable import/no-unresolved */
import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, InputAdornment, IconButton, Divider, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../../../components/hook-form';
// schema
import schema from '../schema';
// service
import useService from '../service/useService';
// mock
import { provinces, cities } from '../../../registerv2/mock';

// ----------------------------------------------------------------------

export default function AccountProfile() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const { getById, update } = useService();
  const { data: dataUser, isSuccess, isLoading } = getById(user?._id);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!isSuccess) return;

    reset(dataUser);
  }, [isSuccess, dataUser, reset]);

  const values = watch();

  useEffect(() => {
    if (!values.oldPassword) {
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    }
  }, [values.oldPassword]);

  const selectedProvince = values?.province;
  // const selectedCity = values?.city;

  // Get available cities based on selected province
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities[selectedProvince?.toLocaleLowerCase()] || [];
  }, [selectedProvince]);

  const onSubmit = async () => {
    const formData = new FormData();

    const excludedFields = ['ktp', 'npwp', 'oldPassword', 'newPassword', 'confirmPassword'];

    // ambil key yang valid dari schema
    const schemaKeys = Object.keys(schema.getDefault());

    schemaKeys.forEach((key) => {
      const value = values[key];
      // skip field yang tidak boleh dikirim
      if (excludedFields.includes(key)) return;

      // khusus file
      if (key === 'image') {
        if (value instanceof File) {
          formData.append(key, value);
        }
        return;
      }

      formData.append(key, value);
    });

    if (values.ktp?.number) {
      formData.append('ktp[number]', values.ktp.number);
    }
    if (values.npwp?.number) {
      formData.append('npwp[number]', values.npwp.number);
    }

    if (values.newPassword) {
      formData.append('oldPassword', values.oldPassword);
      formData.append('password', values.newPassword);
      formData.append('confirmPassword', values.confirmPassword);
    }

    await handleMutationFeedback(update.mutateAsync({ id: user?._id, payload: formData }), {
      successMsg: 'Profil berhasil disimpan!',
      errorMsg: 'Gagal menyimpan profil!',
      onSuccess: () => queryClient.invalidateQueries('authUser'),
      enqueueSnackbar,
    });
  };

  return (
    <Box>
      <FormProvider key={1} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Informasi Profil</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="username" label="Username" loading={isLoading} />
                  <RHFTextField name="fullname" label="Full Name" loading={isLoading} />
                  <RHFTextField name="email" type="email" label="Email" loading={isLoading} />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="phone" label="Phone 1" loading={isLoading} />
                  <RHFTextField name="phone2" label="Phone 2" loading={isLoading} />
                  <RHFTextField name="phone3" label="Phone 3" loading={isLoading} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Informasi Data Diri</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField
                    name="ktp.number"
                    label="No. KTP"
                    disabled={user?.role !== 'owner'}
                    loading={isLoading}
                  />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="npwp.number" label="NPWP" disabled={user?.role !== 'owner'} loading={isLoading} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Informasi Alamat</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="address" label="Alamat" multiline rows={4.48} loading={isLoading} />
                  <RHFSelect name="province" label="Provinsi" SelectProps={{ native: false }} loading={isLoading}>
                    <MenuItem value="" disabled>
                      Pilih Provinsi
                    </MenuItem>
                    <Divider />
                    {provinces.map((result, index) => (
                      <MenuItem value={result?.value?.toUpperCase()} key={index}>
                        {result?.name?.toUpperCase()}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFSelect
                    name="city"
                    label="Kota/Kabupaten"
                    SelectProps={{ native: false }}
                    disabled={!selectedProvince}
                    loading={isLoading}
                  >
                    <MenuItem value="" disabled>
                      Pilih Kota
                    </MenuItem>
                    <Divider />
                    {availableCities.map((result, index) => (
                      <MenuItem value={result?.value?.toUpperCase()} key={index}>
                        {result?.name?.toUpperCase()}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFTextField name="district" label="Kecamatan" loading={isLoading} />
                  <RHFTextField name="zipCode" label="Kode Pos" loading={isLoading} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Ubah Kata Sandi</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="role" label="Hak Akses" disabled loading={isLoading} />
                  <RHFTextField
                    name="oldPassword"
                    type={showPassword ? 'text' : 'password'}
                    label="Kata Sandi Lama"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    loading={isLoading}
                  />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField
                    name="newPassword"
                    type={showPasswordNew ? 'text' : 'password'}
                    label="Kata Sandi Baru"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswordNew(!showPasswordNew)} edge="end">
                            <Iconify icon={showPasswordNew ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={!values.oldPassword}
                    loading={isLoading}
                  />
                  <RHFTextField
                    name="confirmPassword"
                    label="Konfirmasi Kata Sandi Baru"
                    type={showPasswordNew ? 'text' : 'password'}
                    disabled={!values.oldPassword}
                    loading={isLoading}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </FormProvider>
    </Box>
  );
}
