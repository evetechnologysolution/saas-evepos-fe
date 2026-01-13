import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, MenuItem, Divider, Button } from '@mui/material';
// routes
import axios from 'src/utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
// hooks
import useAuth from '../../../hooks/useAuth';
import { roleOptions } from '../../../_mock/roleOptions';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentData }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape(
    isEdit
      ? {
          fullname: Yup.string().required('Fullname is required'),
          username: Yup.string().required('Username is required'),
          description: Yup.string(),
          image: Yup.string(),
          password: Yup.string()
            .test('is-password-present', 'Must be exactly 6 digits and contain only numbers', (value) => {
              if (value && value.length > 0) {
                // Pastikan hanya angka dan panjang tepat 6 karakter
                const isValidLength = value.length === 6;
                const isNumeric = /^[0-9]+$/.test(value);
                return isValidLength && isNumeric;
              }
              return true; // Jika password kosong, tidak perlu divalidasi
            })
            .notRequired(),
          role: Yup.string().required('Role is required'),
        }
      : {
          fullname: Yup.string().required('Fullname is required'),
          username: Yup.string().required('Username is required'),
          description: Yup.string(),
          image: Yup.string(),
          password: Yup.string()
            .required('Password is required')
            .matches(/^[0-9]+$/, 'Must be only numbers')
            .min(6, 'Must be exactly 6 digits'),
          role: Yup.string().required('Role is required'),
        }
  );

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      fullname: currentData?.fullname || '',
      username: currentData?.username || '',
      description: currentData?.description || '',
      image: currentData?.image || '',
      role: currentData?.role || '',
      isActive: currentData?.isActive || true,
      password: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();

      // eslint-disable-next-line no-restricted-syntax
      for (const key in values) {
        if (key === 'image' && values[key]) {
          formData.append(key, values[key]);
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      if (isEdit) {
        await axios.patch(`/users/${currentData._id}`, formData);
      } else {
        await axios.post(`/users`, formData);
      }

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit the form', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {isEdit && <RHFTextField name="id" label="User ID" disabled />}
              <RHFTextField name="fullname" label="Fullname" autoComplete="off" />

              <RHFTextField name="username" label="Username" autoComplete="off" />

              <RHFTextField
                name="password"
                label={`Password ${isEdit ? '(Biarkan kosong jika tidak diganti)' : ''}`}
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={(e) => {
                  e.preventDefault();
                  setValue('password', e.target.value.replace(/[^0-9]/g, ''));
                }}
                autoComplete="new-password"
              />

              {user?._id !== currentData?._id && (
                <>
                  <RHFSelect name="role" label="Role" placeholder="Role" SelectProps={{ native: false }}>
                    <MenuItem
                      value=""
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
                    {roleOptions.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                        disabled={
                          (isEdit && currentData?.role === 'Super Admin') || item === 'Super Admin'
                            ? Boolean(true)
                            : Boolean(false)
                        }
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  {isEdit && currentData?.role !== 'Super Admin' && (
                    <RHFSwitch
                      name="isActive"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Active User
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Disabling this will revoke the user's login access
                          </Typography>
                        </>
                      }
                      sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  )}
                </>
              )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.user.root)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'New User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
        {values.role === 'Content Writer' && (
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <RHFTextField name="description" multiline rows={3} label="Description" autoComplete="off" />
              <Stack spacing={3}>
                <div>
                  <Typography sx={{ mt: 3, mb: 1 }}>{`Image (max size: 900KB)`}</Typography>
                  <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
                </div>
              </Stack>
            </Card>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
}
