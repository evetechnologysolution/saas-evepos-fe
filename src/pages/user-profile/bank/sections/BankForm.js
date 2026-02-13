import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, MenuItem, Divider, Button, Checkbox, ListItemText } from '@mui/material';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFSelectMultiple, RHFTextField } from '../../../../components/hook-form';
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

  const { data: dataOulet, isLoading } = listOulet({
    page: 1,
    perPage: 10,
  });

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
    if (!isEdit) return;

    reset(currentData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData, reset]);

  const values = watch();

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* <RHFSelectMultiple
                name="outletRef"
                label="Pilih Outlet"
                placeholder=""
                renderValue={(selected = []) =>
                  selected.map((id) => dataOulet?.docs?.find((o) => o._id === id)?.name || '').join(', ')
                }
                // options={dataOulet?.docs}
              >
                {dataOulet?.docs.map((result, index) => (
                  <MenuItem value={result?._id} key={index}>
                    <Checkbox checked={values?.outletRef?.indexOf(result?._id) > -1} size="small" />
                    <ListItemText primary={result?.name} />
                  </MenuItem>
                ))}
              </RHFSelectMultiple> */}
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
              <RHFTextField name="accountHolderName" label="Pemegang Rekening" autoComplete="off" />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.profile.bank)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'New Bank' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
