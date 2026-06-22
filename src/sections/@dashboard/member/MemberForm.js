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
import { Box, Card, Stack, Button, CircularProgress, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../components/hook-form';
// utils
import axiosApi from '../../../utils/axios';
import splitName from '../../../utils/splitName';

// ----------------------------------------------------------------------

MemberForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default function MemberForm({ isEdit, currentData, isLoading }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    memberId: Yup.string(),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    phone: Yup.string()
      .required('Nomor WhatsApp wajib diisi')
      .matches(/^[0-9+]+$/, 'Nomor WhatsApp hanya boleh berisi angka'),
    email: Yup.string().email('Format email tidak valid').notRequired(),
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
    isActive: Yup.boolean().required().default(true),
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
      isActive: currentData?.isActive ?? true,
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
        await axiosApi.post(`/member`, data);
      } else {
        await axiosApi.patch(`/member/${currentData._id}`, data);
      }

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.member.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || 'Server error!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Card sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720, mx: 'auto' }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h6">{isEdit ? 'Edit Member' : 'Informasi Member'}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Kolom bertanda <Box component="span" sx={{ color: 'error.main' }}>*</Box> wajib diisi.
            </Typography>
          </Stack>

          <Stack spacing={3}>
            {isEdit && <RHFTextField name="memberId" label="Member ID" disabled />}

            <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField name="firstName" label="First Name" required autoComplete="off" />
              <RHFTextField name="lastName" label="Last Name" required autoComplete="off" />
            </Stack>

            <RHFTextField
              name="phone"
              label="Nomor WhatsApp"
              required
              placeholder="081........."
              autoComplete="off"
              inputMode="tel"
            />

            <RHFTextField
              name="email"
              label="Email (Opsional)"
              type="email"
              placeholder="nama@email.com"
              autoComplete="off"
            />

            {isEdit && (
              <>
                <RHFTextField
                  name="password"
                  label="Password (Biarkan kosong jika tidak diganti)"
                  type="password"
                  autoComplete="new-password"
                />
                <RHFSwitch
                  name="isActive"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Active
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disable this for inactive members
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />
              </>
            )}
          </Stack>

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="flex-end"
            sx={{ mt: 4 }}
            gap={1.5}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(PATH_DASHBOARD.member.list)}
              sx={{ width: { sm: 'auto' } }}
            >
              Back
            </Button>
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              loading={loading}
              sx={{ width: { sm: 'auto' } }}
            >
              {!isEdit ? 'New Member' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Card>
      )}
    </FormProvider>
  );
}
