import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, MenuItem, Divider, Button, InputAdornment, IconButton, Autocomplete, TextField } from '@mui/material';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import Iconify from 'src/components/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { roleOptions } from '../../../_mock/roleOptions';
import useOutlet from '../../../pages/outlet/service/useOutlet';
import schema from '../../../pages/user/schema';
import schemaEdit from '../../../pages/user/schema/edit';
import useUser from '../../../pages/user/service/useUser';

// ----------------------------------------------------------------------

UserForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

function capitalizeFirstLetter(string) {
  if (typeof string !== 'string' || string.length === 0) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function UserForm({ isEdit, currentData }) {
  const { list: listOulet } = useOutlet();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { create, update } = useUser();

  const [showPassword, setShowPassword] = useState(false);

  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      outletRef: currentData?.outletRef?._id || currentData?.outletRef || null,
      fullname: currentData?.fullname || '',
      username: currentData?.username || '',
      role: capitalizeFirstLetter(currentData?.role) || '',
      password: '',
      phone: currentData?.phone || '',
      email: currentData?.email || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const dynamicSchema = isEdit ? schemaEdit : schema;

  const methods = useForm({
    resolver: yupResolver(dynamicSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
    const mutation = isEdit ? update.mutateAsync({ id: currentData._id, payload: data }) : create.mutateAsync(data);

    await handleMutationFeedback(mutation, {
      successMsg: isEdit ? 'User berhasil diperbarui!' : 'User berhasil dibuat!',
      errorMsg: 'Gagal menyimpan user!',
      onSuccess: () => navigate(PATH_DASHBOARD.user.root),
      enqueueSnackbar,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {isEdit && <RHFTextField name="id" label="User ID" disabled />}

              <Controller
                name="outletRef"
                control={control}
                defaultValue={[]}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    options={dataOulet?.docs || []}
                    value={
                      dataOulet?.docs?.find((option) => option._id === field.value) || null
                    }
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, newValue) =>
                      field.onChange(newValue ? newValue._id : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pilih Outlet"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <RHFTextField name="fullname" label="Fullname" autoComplete="off" />

              <RHFTextField name="username" label="Username" autoComplete="off" />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>

              <RHFTextField name="email" label="Email" type="email" autoComplete="off" />

              <RHFTextField name="phone" inputMode="numeric" label="Phone" autoComplete="off" />

              <RHFTextField
                name="password"
                label={`Password ${isEdit ? '(Biarkan kosong jika tidak diganti)' : ''}`}
                type={showPassword ? 'text' : 'password'}
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
                        (isEdit && currentData?.role?.toLowerCase() === 'owner') || item?.toLowerCase() === 'owner'
                          ? Boolean(true)
                          : Boolean(false)
                      }
                    >
                      {item}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.user.root)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={loadingOutlet}>
                {!isEdit ? 'New User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
