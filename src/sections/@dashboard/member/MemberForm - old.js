import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, MenuItem, Divider } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFSelect } from '../../../components/hook-form';
// utils
import axiosApi from '../../../utils/axios';
import { provincies, cities } from '../../../_mock/regions';

// ----------------------------------------------------------------------

MemberForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function MemberForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [subdistrictList, setSubdistrictList] = useState([]);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    memberId: Yup.string(),
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email(),
    province: Yup.string(),
    city: Yup.string(),
    district: Yup.string(),
    subdistrict: Yup.string(),
    address: Yup.string(),
    addressNotes: Yup.string(),
    password: isEdit
      ? Yup.string()
        .test('is-password-present', 'Must be at least 6 characters', (value) => {
          if (value && value.length > 0) {
            return value.length >= 6;
          }
          return true; // If password is empty, don't enforce the 6 char rule
        })
        .notRequired() // password not required if empty
      : Yup.string().required('Password is required').min(6, 'Must be at least 6 characters'),
  });

  const prevData = Array.isArray(currentData?.addresses) ? currentData.addresses.find((item) => item.isDefault) : null;

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      memberId: currentData?.memberId || '',
      name: currentData?.name || '',
      phone: currentData?.phone || '',
      email: currentData?.email || '',
      province: prevData?.province || 'JAWA TENGAH',
      city: prevData?.city || '',
      district: prevData?.district || '',
      subdistrict: prevData?.subdistrict || '',
      address: prevData?.address || '',
      addressNotes: prevData?.addressNotes || '',
      password: isEdit ? '' : '123456',
    }),
    [currentData, isEdit, prevData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

  const handleGetDistrict = async (val) => {
    try {
      const response = await axios.get(`https://evetechregion.vercel.app/api/district/${val.provinceId}/${val.id}`);
      if (response?.data) {
        setDistrictList(response.data);
      } else {
        setDistrictList([]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistrictList([]);
    } finally {
      setValue('district', '');
      setValue('subdistrict', '');
      setSubdistrictList([]);
    }
  };

  const handleGetSubdistrict = async (val) => {
    try {
      const response = await axios.get(
        `https://evetechregion.vercel.app/api/subdistrict/${val.provinceId}/${val.cityId}/${val.id}`
      );
      if (response?.data) {
        setSubdistrictList(response.data);
      } else {
        setSubdistrictList([]);
      }
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      setSubdistrictList([]);
    } finally {
      setValue('subdistrict', '');
    }
  };

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && prevData) {
        if (prevData?.city) {
          const originCity = cities.find((item) => item.name === prevData?.city);
          if (originCity) {
            await handleGetDistrict(originCity); // Tunggu data distrik diperbarui
            setValue('district', currentData?.district, prevData?.district);
          }
        }
      }
    };

    fetchData(); // Panggil fungsi fetchData untuk menjalankan logika
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, prevData, cities]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && prevData) {
        if (prevData?.district && districtList) {
          const originDistrict = districtList.find((item) => item.name === prevData?.district);
          if (originDistrict) {
            await handleGetSubdistrict(originDistrict); // Tunggu data subdistrik diperbarui
            setValue('subdistrict', prevData?.subdistrict);
          }
        }
      }
    };

    fetchData(); // Panggil fungsi fetchData untuk menjalankan logika
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, prevData, districtList]);

  const getCoordinates = async (province, city, district, subdistrict) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const locationString = `${subdistrict}, ${district}, ${city}, ${province}, Indonesia`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      locationString
    )}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      return {
        placeId: result?.place_id || '',
        lat: result?.geometry?.location?.lat || 0,
        lng: result?.geometry?.location?.lng || 0,
      };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return { placeId: '', lat: 0, lng: 0 };
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const location = await getCoordinates(data.province, data.city, data.district, data.subdistrict);

      const formatAddressData = (data) => ({
        label: prevData?.label || 'Utama',
        address: `${data.subdistrict}, ${data.district}, ${data.city}, ${data.province}`,
        addressNotes: data.addressNotes,
        province: data.province,
        city: data.city,
        district: data.district,
        subdistrict: data.subdistrict,
        location,
        isDefault: true,
      });

      if (!isEdit) {
        data.addresses = [formatAddressData(data)];
        await axiosApi.post(`/members`, data);
      } else {
        const previousAddresses = currentData?.addresses?.filter((val) => !val.isDefault) || [];
        data.addresses = [...previousAddresses, formatAddressData(data)];
        await axiosApi.patch(`/members/${currentData._id}`, data);
      }

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.member.list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {isEdit && (
                <>
                  {/* <RHFTextField name="id" label="ID" disabled /> */}
                  <RHFTextField name="memberId" label="Member ID" disabled />
                </>
              )}
              <RHFTextField name="name" label="Name" autoComplete="off" />
              <RHFTextField name="phone" label="Phone" autoComplete="off" />
              <RHFTextField name="email" label="Email" type="email" autoComplete="off" />
              <RHFTextField
                name="password"
                label={`Password ${isEdit ? '(Biarkan kosong jika tidak diganti)' : ''}`}
                type="password"
                autoComplete="new-password"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                  <RHFSelect
                    name="province"
                    label="Province"
                    placeholder="Province"
                    SelectProps={{ native: false }}
                    disabled
                  >
                    <MenuItem
                      value={0}
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                      disabled
                    >
                      Select One
                    </MenuItem>
                    <Divider />
                    {provincies.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item.name}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={6} md={6}>
                  <RHFSelect name="city" label="City" placeholder="City" SelectProps={{ native: false }}>
                    <MenuItem
                      value={0}
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                      disabled
                    >
                      Select One
                    </MenuItem>
                    <Divider />
                    {cities.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item.name}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                        onClick={() => handleGetDistrict(item)}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={6} md={6}>
                  <RHFSelect name="district" label="District" placeholder="District" SelectProps={{ native: false }}>
                    <MenuItem
                      value={0}
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                      disabled
                    >
                      Select One
                    </MenuItem>
                    <Divider />
                    {districtList?.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item?.name}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                        onClick={() => handleGetSubdistrict(item)}
                      >
                        {item?.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={6} md={6}>
                  <RHFSelect
                    name="subdistrict"
                    label="Subdistrict"
                    placeholder="Subdistrict"
                    SelectProps={{ native: false }}
                  >
                    <MenuItem
                      value={0}
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                      disabled
                    >
                      Select One
                    </MenuItem>
                    <Divider />
                    {subdistrictList?.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item?.name}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                      >
                        {item?.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
              </Grid>
              <RHFTextField name="address" label="Address" autoComplete="off" multiline rows={4} />
              <span style={{ marginTop: '11px' }} />
              <RHFTextField name="addressNotes" label="Address Notes" autoComplete="off" />
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.member.list)}>
            Back
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {!isEdit ? 'New Member' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
