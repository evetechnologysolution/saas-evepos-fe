import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled, Typography, Card, Grid, Stack, Button, InputAdornment, FormControlLabel, Switch, Divider, Autocomplete, Chip, TextField } from '@mui/material';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField, RHFNumericFormat } from '../../../../components/hook-form';
// hook
import useAuth from '../../../../hooks/useAuth';
//
import schema from '../../../../pages/library/variant/schema';
import useVariant from '../../../../pages/library/variant/service/useVariant';
import useOutlet from '../../../../pages/outlet/service/useOutlet';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { create, update } = useVariant();
  const { list: listOulet } = useOutlet();
  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
      caption: currentData?.caption || '',
      showOnWeb: currentData?.showOnWeb ?? false,
      outletRef: currentData?.outletRef || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: currentData?._id || '',
      name: currentData?.name || '',
      caption: currentData?.caption || '',
      showOnWeb: currentData?.showOnWeb ?? false,
      options: currentData?.options || [
        { name: '', price: 0, productionPrice: 0, notes: '', productionNotes: '', isMulti: false, isDefault: false },
      ],
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    getValues,
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
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {user?.tenantRef?.isEvewash && (
                <Stack flexDirection="row" justifyContent="flex-end" alignItems="center" gap={1} sx={{ width: '100%' }}>
                  <Controller
                    name="showOnWeb"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={
                          <>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                              Show on Website
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Enable to display on the website order page
                            </Typography>
                          </>
                        }
                        control={
                          <CustomSwitch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                        }
                      />
                    )}
                  />
                </Stack>
              )}

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
                  />
                )}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
                <RHFTextField name="name" label="Variant Name" autoComplete="off" />
                <RHFTextField name="caption" label="Variant Caption" autoComplete="off" />
              </Stack>

              <Typography variant="subtitle1">List of Options</Typography>

              {fields.map((field, index) => (
                <Stack key={field.id} gap={3}>
                  <Stack
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    gap={1}
                  >
                    <Typography variant="subtitle2">No. {index + 1}</Typography>
                    {fields.length > 1 && (
                      <Button
                        sx={{
                          boxShadow: '0',
                          p: 0,
                          minWidth: 30,
                          height: 30,
                        }}
                        size="large"
                        color="error"
                        onClick={() => remove(index)}
                      >
                        <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                      </Button>
                    )}
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
                    <RHFTextField
                      name={`options.${index}.name`}
                      label="Option Name"
                      fullWidth
                      autoComplete="off"
                    />

                    <RHFTextField
                      name={`options.${index}.notes`}
                      label="Option Notes"
                      fullWidth
                      autoComplete="off"
                    />

                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" gap={3}>
                      <RHFNumericFormat
                        name={`options.${index}.price`}
                        label="Price"
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                        }}
                      />
                      <RHFNumericFormat
                        name={`options.${index}.productionPrice`}
                        label="Production Cost"
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                        }}
                      />
                    </Stack>
                    <Stack
                      flexDirection={{ xs: "column", md: "row" }}
                      justifyContent={{ md: "space-between" }}
                      alignItems={{ md: "center" }}
                      width="100%"
                      gap={1}
                    >
                      <Controller
                        name={`options.${index}.isMultiple`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            label={
                              <>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                  Multiple Qty
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Enable for multiple
                                </Typography>
                              </>
                            }
                            control={
                              <CustomSwitch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                            }
                          />
                        )}
                      />
                      {user?.tenantRef?.isEvewash && (
                        <Controller
                          name={`options.${index}.isDefault`}
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              label={
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Default Option
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Enable for default option
                                  </Typography>
                                </>
                              }
                              control={
                                // <CustomSwitch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                <CustomSwitch
                                  checked={field.value}
                                  onChange={(e) => {
                                    const checked = e.target.checked;

                                    const list = getValues('options');

                                    list.forEach((_, i) => {
                                      setValue(`options.${i}.isDefault`, i === index ? checked : false);
                                    });
                                  }}
                                />
                              }
                            />
                          )}
                        />
                      )}
                    </Stack>
                  </Stack>
                  <Divider />
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
                      notes: '',
                      productionNotes: '',
                      isMulti: false,
                      isDefault: false,
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
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={loadingOutlet}>
                {!isEdit ? 'New Variant' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
