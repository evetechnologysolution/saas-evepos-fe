/* eslint-disable import/no-unresolved */
import { useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
// form
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Divider, MenuItem, Button, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../../../components/hook-form';
import Iconify from '../../../../components/Iconify';
// schema
import schema from '../schema';
// service
import useService from '../service/useService';
// mock
import { businessOptions } from '../../../../_mock/businessOptions';
import { legalOptions } from '../../../../_mock/legalOptions';
import { socialOptions } from '../../../../_mock/socialOptions';
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
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: 'socialMedia',
  });

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

      if (key === 'socialMedia' && Array.isArray(value)) {
        if (value.length === 0) {
          formData.append('socialMedia', 'reset');
          return;
        }
        value.forEach((item, index) => {
          formData.append(`socialMedia[${index}][platform]`, item.platform || '');
          formData.append(`socialMedia[${index}][account]`, item.account || '');
        });
        return;
      }

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
                  <RHFTextField name="ownerName" label="Nama Pemilik" disabled loading={isLoading} />
                  <RHFTextField name="businessName" label="Nama Bisnis" loading={isLoading} />
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
              <Typography variant="h6">Informasi Profil Bisnis</Typography>
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
                  <RHFTextField name="description" label="Deskripsi Bisnis" multiline rows={4.48} loading={isLoading} />
                </Box>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 2 }}>
                  <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    <RHFSelect
                      name="businessType"
                      label="Jenis Usaha"
                      SelectProps={{ native: false }}
                      disabled
                      loading={isLoading}
                    >
                      <MenuItem value="" disabled>
                        Pilih Satu
                      </MenuItem>
                      <Divider />
                      {businessOptions.map((row, i) => (
                        <MenuItem key={i} value={row}>
                          {row}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFSelect
                      name="legalStatus"
                      label="Bentuk Usaha"
                      SelectProps={{ native: false }}
                      loading={isLoading}
                    >
                      <MenuItem value="" disabled>
                        Pilih Satu
                      </MenuItem>
                      <Divider />
                      {legalOptions.map((row, i) => (
                        <MenuItem key={i} value={row}>
                          {row}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <RHFTextField name="website" label="Website" loading={isLoading} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Informasi Sosial Media</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                {socialFields.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' },
                      alignItems: 'center',
                    }}
                  >
                    <RHFSelect
                      name={`socialMedia.${index}.platform`}
                      label="Sosial Media"
                      SelectProps={{ native: false }}
                    >
                      <MenuItem value="" disabled>
                        Pilih Satu
                      </MenuItem>
                      <Divider />
                      {socialOptions.map((row, i) => (
                        <MenuItem key={i} value={row}>
                          {row}
                        </MenuItem>
                      ))}
                    </RHFSelect>

                    <RHFTextField name={`socialMedia.${index}.account`} label="Url / Username" />

                    <IconButton color="error" onClick={() => removeSocial(index)}>
                      <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                    </IconButton>
                  </Box>
                ))}

                <Box>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      appendSocial({
                        platform: '',
                        account: '',
                      })
                    }
                    disabled={values?.socialMedia?.length === 4}
                  >
                    + Tambah Sosial Media
                  </Button>
                </Box>
              </Stack>
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
