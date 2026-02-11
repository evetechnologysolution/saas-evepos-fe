/* eslint-disable import/no-unresolved */
import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Divider, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
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
  const { data: dataTenant, isSuccess, isLoading } = getById(user?.tenantRef?._id);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!isSuccess) return;

    reset(dataTenant);
  }, [isSuccess, dataTenant, reset]);

  const values = watch();

  const selectedProvince = values?.province;
  // const selectedCity = values?.city;

  // Get available cities based on selected province
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities[selectedProvince?.toLocaleLowerCase()] || [];
  }, [selectedProvince]);

  const onSubmit = async () => {
    const formData = new FormData();

    // ambil key yang valid dari schema
    const schemaKeys = Object.keys(schema.getDefault());

    schemaKeys.forEach((key) => {
      const value = values[key];
      // skip kosong
      if (value === null || value === undefined || value === '') return;

      // khusus file
      if (key === 'image') {
        if (value instanceof File) {
          formData.append(key, value);
        }
        return;
      }

      formData.append(key, value);
    });

    await handleMutationFeedback(update.mutateAsync({ id: user?.tenantRef?._id, payload: formData }), {
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
            {/* <Grid item xs={12}>
              <Divider />
            </Grid> */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Informasi Kontak Bisnis</Typography>
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
                  <RHFTextField name="ownerName" label="Nama Pemilik" disabled />
                  <RHFTextField name="businessName" label="Nama Bisnis" />
                  <RHFTextField name="email" type="email" label="Email" />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="phone" label="Phone 1" />
                  <RHFTextField name="phone2" label="Phone 2" />
                  <RHFTextField name="phone3" label="Phone 3" />
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
                  <RHFTextField name="address" label="Alamat" multiline rows={4.48} />
                  <RHFSelect name="province" label="Provinsi" SelectProps={{ native: false }}>
                    <MenuItem value="">Pilih Provinsi</MenuItem>
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
                  >
                    <MenuItem value="">Pilih Kota</MenuItem>
                    {availableCities.map((result, index) => (
                      <MenuItem value={result?.value?.toUpperCase()} key={index}>
                        {result?.name?.toUpperCase()}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFTextField name="district" label="Kecamatan" />
                  <RHFTextField name="zipCode" label="Kode Pos" />
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
