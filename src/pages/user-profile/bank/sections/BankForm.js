import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, MenuItem, Divider, Button, Typography, Autocomplete, TextField, Chip } from '@mui/material';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadSingleFile } from '../../../../components/hook-form';
// hooks
import { bankOptions } from '../../../../_mock/bankOptions';
import schema from '../schema';
import useService from '../service/useService';

// ----------------------------------------------------------------------

BankForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function BankForm({ isEdit, currentData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { listOulet, create, update } = useService();

  const maxSize = {
    label: '900KB',
    value: 900000,
  };

  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (isEdit) return; // hanya saat create
    if (!dataOulet?.docs?.length) return;

    const primaryOutlet = dataOulet.docs.find((item) => item.isPrimary);

    if (primaryOutlet) {
      setValue('outletRef', [primaryOutlet._id]);
    }
  }, [isEdit, dataOulet, setValue]);

  useEffect(() => {
    if (!isEdit) return;

    const objData = {
      ...currentData,
      imageAccount: currentData?.imageAccount?.image || '',
      imageHolder: currentData?.imageHolder?.image || '',
    };

    reset(objData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData, reset]);

  const values = watch();

  const handleDropAccount = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imageAccount',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleDropHolder = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imageHolder',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = async () => {
    const formData = new FormData();

    const excludedFields = ['imageAccountUrl', 'imageHolderUrl'];

    // ambil key yang valid dari schema
    const schemaKeys = Object.keys(schema.getDefault());

    schemaKeys.forEach((key) => {
      const value = values[key];
      // skip field yang tidak boleh dikirim
      if (excludedFields.includes(key)) return;

      // khusus file
      if (key === 'imageAccount' || key === 'imageHolder') {
        if (value instanceof File) {
          formData.append(key, value);
        }
        return;
      }

      // handle array
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
        return;
      }

      formData.append(key, value);
    });

    const mutation = isEdit
      ? update.mutateAsync({ id: currentData._id, payload: formData })
      : create.mutateAsync(formData);

    await handleMutationFeedback(mutation, {
      successMsg: isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil dibuat!',
      errorMsg: 'Gagal menyimpan data!',
      onSuccess: () => navigate(PATH_DASHBOARD.profile.bank),
      enqueueSnackbar,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Controller
                name="outletRef"
                control={control}
                defaultValue={[]}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    options={dataOulet?.docs || []}
                    value={dataOulet?.docs?.filter((option) => field.value?.includes(option._id)) || []}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, newValue) => field.onChange(newValue.map((item) => item._id))}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Pilih Outlet" error={!!error} helperText={error?.message} />
                    )}
                    // disabled={!isEdit}
                    disabled
                  />
                )}
              />

              <RHFSelect name="bankName" label="Nama Bank" SelectProps={{ native: false }}>
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
                  Pilih Satu
                </MenuItem>
                <Divider />
                {bankOptions.map((item, n) => (
                  <MenuItem
                    key={n}
                    value={item}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="accountNumber" label="No. Rekening" autoComplete="off" />
              <Stack flexDirection="column" gap={1}>
                <Typography>{`Foto Informasi Rekening (max size: ${maxSize.label})`}</Typography>
                <RHFUploadSingleFile
                  name="imageAccount"
                  accept="image/*"
                  maxSize={maxSize.value}
                  onDrop={handleDropAccount}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <RHFTextField name="accountHolderName" label="Pemegang Rekening" autoComplete="off" />
              <Stack flexDirection="column" gap={1}>
                <Typography>{`KTP / NPWP / KITAS Pemegang Rekening (max size: ${maxSize.label})`}</Typography>
                <RHFUploadSingleFile
                  name="imageHolder"
                  accept="image/*"
                  maxSize={maxSize.value}
                  onDrop={handleDropHolder}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.profile.bank)}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={loadingOutlet}>
            {!isEdit ? 'New Bank' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
