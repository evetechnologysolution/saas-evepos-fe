import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// utils
import axiosApi from '../../../utils/axios';
import splitName from '../../../utils/splitName';

// ----------------------------------------------------------------------

MemberForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function MemberForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    memberId: Yup.string(),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email(),
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

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      memberId: currentData?.memberId || '',
      firstName: currentData?.firstName ? currentData?.firstName : splitName(currentData?.name).firstName,
      lastName: currentData?.lastName ? currentData?.lastName : splitName(currentData?.name).lastName,
      phone: currentData?.phone || '',
      email: currentData?.email || '',
      password: isEdit ? '' : '123456',
    }),
    [currentData, isEdit]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (!isEdit) {
        await axiosApi.post(`/members`, data);
      } else {
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
              <Stack gap={3} flexDirection="row">
                <RHFTextField name="firstName" label="First Name" autoComplete="off" />
                <RHFTextField name="lastName" label="Last Name" autoComplete="off" />
              </Stack>
              <RHFTextField name="phone" label="Phone" autoComplete="off" />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <RHFTextField name="email" label="Email" type="email" autoComplete="off" />
              <RHFTextField
                name="password"
                label={`Password ${isEdit ? '(Biarkan kosong jika tidak diganti)' : ''}`}
                type="password"
                autoComplete="new-password"
              />
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
