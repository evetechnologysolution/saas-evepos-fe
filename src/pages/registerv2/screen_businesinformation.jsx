/* eslint-disable camelcase */
/* eslint-disable react/jsx-boolean-value */
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Divider, Grid, MenuItem } from '@mui/material';
// hooks
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import useAuth from 'src/hooks/useAuth';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Logo from '../../components/LogoForLogin';
import LoginPicture from '../../components/LoginPicture';
import schema from './schema/businesinformation';
import { business_sector, business_year_operation, provinces, cities } from './mock';
// sections
// ----------------------------------------------------------------------
const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1), // mobile
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5), // desktop/laptop
  },
}));

// ----------------------------------------------------------------------
export default function RegisterEmailConfirm() {
  const { themeStretch } = useSettings();
  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const selectedProvince = watch('province');
  const selectedCity = watch('city');

  // Get available cities based on selected province
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities[selectedProvince] || [];
  }, [selectedProvince]);

  const onSubmit = async (data) => {
    try {
      await axios.patch(`/tenant/complete/${auth.user?.tenantRef?._id}`, data);
      enqueueSnackbar('Data berhasil disimpan', { variant: 'success' });
      navigate('/dashboard/app');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan, coba lagi';

      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <Page title="Register">
      <Container
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          backgroundImage: 'url("/register/background.webp")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <ContentStyle>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3em' }}>
            <img src="/logo/logo.webp" alt="logo" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                backgroundColor: 'white',
                width: { xs: '100%', sm: '80%', md: '50%' },
                p: '1.5em',
                borderRadius: '1em',
                boxShadow: '0px 4px 6px -4px #18274B1F',
              }}
            >
              <Typography variant="h4" align="center">
                Informasi Usaha
              </Typography>
              <Divider sx={{ marginY: '1em' }} />
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} fullwidth={true}>
                <Grid container spacing={3} sx={{ marginBottom: '1.5em' }}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="fullName" label="Nama pemilik usaha" placeholder="nama" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="businessName" label="Nama usaha" placeholder="nama usaha" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="businessSector" label="Bidang usaha" SelectProps={{ native: false }}>
                      {business_sector.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          {result.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="yearsInOperation" label="Lama beroperasi" SelectProps={{ native: false }}>
                      {business_year_operation.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          {result.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RHFSelect name="province" label="Provinsi" SelectProps={{ native: false }}>
                      <MenuItem value="">Pilih Provinsi</MenuItem>
                      {provinces.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          {result.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RHFSelect
                      name="city"
                      label="Kota/Kabupaten"
                      SelectProps={{ native: false }}
                      disabled={!selectedProvince}
                    >
                      <MenuItem value="">Pilih Kota</MenuItem>
                      {availableCities.map((result, index) => (
                        <MenuItem value={result.value} key={index}>
                          {result.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RHFTextField name="district" label="Kecamatan" placeholder="kecamatan" disabled={!selectedCity} />
                  </Grid>
                </Grid>
                <LoadingButton variant="contained" fullWidth size="large" type="submit" loading={isSubmitting}>
                  Simpan
                </LoadingButton>
              </FormProvider>
            </Box>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}
