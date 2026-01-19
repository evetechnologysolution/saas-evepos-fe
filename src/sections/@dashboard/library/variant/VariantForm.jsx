import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled, Typography, Card, Grid, Stack, Button, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import { NumericFormat } from 'react-number-format';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// context
import schema from '../../../../pages/library/variant/schema';
import useVariant from '../../../../pages/library/variant/service/useVariant';
// ----------------------------------------------------------------------

VariantForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    margin: 2,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    opacity: 1,
    boxSizing: 'border-box',
  },
}));

// ----------------------------------------------------------------------

export default function VariantForm({ isEdit, currentData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { create, update } = useVariant();

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: currentData?._id || '',
      name: currentData?.name || '',
      options: currentData?.options || [
        { name: '', price: 0, productionPrice: 0, productionNotes: '', isMulti: false },
      ],
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  // list of options

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
      successMsg: isEdit ? 'Variant berhasil diperbarui!' : 'Variant berhasil dibuat!',
      errorMsg: 'Gagal menyimpan variant!',
      onSuccess: () => navigate(PATH_DASHBOARD.library.variant),
      enqueueSnackbar,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Variant Name" autoComplete="off" />

              <Typography variant="subtitle1">List of Options</Typography>

              {fields.map((field, index) => (
                <Stack key={field.id} gap={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
                    <RHFTextField
                      name={`options.${index}.name`}
                      placeholder="Option Name"
                      fullWidth
                      autoComplete="off"
                    />

                    <Controller
                      name={`options.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          {...field}
                          thousandSeparator=","
                          decimalSeparator="."
                          label="Price"
                          customInput={RHFTextField}
                          allowNegative={false}
                          decimalScale={2}
                          onValueChange={(v) => field.onChange(Number(v.value))}
                        />
                      )}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
                    <Controller
                      name={`options.${index}.productionPrice`}
                      control={control}
                      render={({ field }) => (
                        <NumericFormat
                          {...field}
                          customInput={RHFTextField}
                          label="Production Cost"
                          decimalScale={2}
                          thousandSeparator=","
                          allowNegative={false}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                          }}
                          onValueChange={(v) => field.onChange(Number(v.value))}
                        />
                      )}
                    />

                    <Controller
                      name={`options.${index}.isMultiple`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          label="Multiple Qty"
                          control={
                            <CustomSwitch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                          }
                        />
                      )}
                    />

                    {fields.length > 1 && (
                      <Button color="error" onClick={() => remove(index)}>
                        <Iconify icon="eva:trash-2-outline" />
                      </Button>
                    )}
                  </Stack>
                </Stack>
              ))}

              {/* {optionList.length < 5 && ( */}
              <Stack alignItems="center">
                <Button
                  onClick={() =>
                    append({
                      name: '',
                      price: 0,
                      productionPrice: 0,
                      productionNotes: '',
                      isMulti: false,
                    })
                  }
                >
                  <Iconify icon="eva:plus-fill" /> Add Option
                </Button>
              </Stack>
              {/* )} */}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.variant)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'New Variant' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
