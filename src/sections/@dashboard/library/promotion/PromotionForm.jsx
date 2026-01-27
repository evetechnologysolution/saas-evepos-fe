import React, { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

// form
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import schema from '../../../../pages/library/promotion/schema';
import usePromotion from '../../../../pages/library/promotion/service/usePromotion';

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadSingleFile,
  RHFSwitch,
  RHFDaySelect,
} from '../../../../components/hook-form';
import Iconify from '../../../../components/Iconify';

// hook
import useResponsive from '../../../../hooks/useResponsive';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// context
import { mainContext } from '../../../../contexts/MainContext';

PromotionForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function PromotionForm({ currentData, isEdit }) {
  const navigate = useNavigate();
  const { create, update } = usePromotion();

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || null,
      name: currentData?.name ?? '',
      type: currentData?.type ?? 1,
      amount: currentData?.type === 1 ? currentData?.amount ?? 0 : 0,
      qtyMin: currentData?.type === 3 ? currentData?.qtyMin ?? 0 : 0,
      qtyFree: currentData?.type === 3 ? currentData?.qtyFree ?? 0 : 0,
      validUntil: currentData?.validUntil ?? false,
      startDate: currentData?.startDate ? new Date(currentData.startDate) : new Date(),
      endDate: currentData?.validUntil && currentData?.endDate ? new Date(currentData.endDate) : '',
      selectedDay:
        currentData?.selectedDay !== undefined && currentData?.selectedDay !== null ? currentData.selectedDay[0] : '',
      isAvailable: currentData?.isAvailable ?? true,
      image: currentData?.image ?? '',
      products: currentData?.products ?? [],
    }),
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    getValues,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { append, replace, remove, fields } = useFieldArray({ control, name: 'products' });

  const { enqueueSnackbar } = useSnackbar();

  const values = watch();

  const ctx = useContext(mainContext);

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

  const handleProductAdd = () => {
    append('');
  };

  const handleOptionRemove = (index) => {
    remove(index);
  };

  const handleProductsChange = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...fields];
    updatedProducts[index] = { ...updatedProducts[index], id: updatedProducts[index].id, value };
    replace(updatedProducts.map((item) => item.value));
  };

  const handleAllProductsCheckbox = (e) => {
    if (e.target.checked) {
      replace(ctx?.product?.map((row) => row?._id) || ['']);
    } else {
      replace(['']);
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
    if (!values.validUntil) {
      setValue('endDate', null);
      clearErrors('endDate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.validUntil]);

  const handleTypeLabel = (type) => {
    if (type === 1) {
      return (
        <RHFTextField
          name="amount"
          label="Discount"
          autoComplete="off"
          value={getValues('amount') === 0 ? '' : getValues('amount')}
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, type: 'number' }}
          onChange={(e) => setValue('amount', Number(e.target.value))}
        />
      );
    }
    if (type === 2) {
      return (
        <NumericFormat
          customInput={RHFTextField}
          name="amount"
          label="Amount"
          autoComplete="off"
          decimalScale={2}
          decimalSeparator="."
          thousandSeparator=","
          allowNegative={false}
          InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }}
          value={getValues('amount') === 0 ? '' : getValues('amount')}
          onValueChange={(values) => setValue('amount', Number(values.value))}
        />
      );
    }
    if (type === 3) return null;

    return <RHFTextField name="amount" label="Amount" autoComplete="off" disabled />;
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('type', Number(data.type));

      formData.append('amount', data.type === 1 ? Number(data.amount) : 0);

      formData.append('qtyMin', data.type === 3 ? Number(data.qtyMin) : 0);
      formData.append('qtyFree', data.type === 3 ? Number(data.qtyFree) : 0);

      formData.append('startDate', data.startDate);
      formData.append('endDate', data.validUntil ? data.endDate : '');
      formData.append('validUntil', data.validUntil);
      formData.append('selectedDay', data.selectedDay === '' ? '' : Number(data.selectedDay));

      formData.append('products', JSON.stringify(data.products || []));

      formData.append('isAvailable', isEdit ? data.isAvailable : true);

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      const mutation = isEdit
        ? update.mutateAsync({
            id: currentData._id,
            payload: formData,
          })
        : create.mutateAsync(formData);

      await handleMutationFeedback(mutation, {
        successMsg: isEdit ? 'Promotion updated successfully!' : 'Promotion added successfully!',
        errorMsg: 'Failed to save promotion!',
        onSuccess: () => navigate(PATH_DASHBOARD.library.promotion),
        enqueueSnackbar,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isMobile = useResponsive('down', 'lg');

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack sx={{ mb: isMobile && 2 }}>
              <RHFTextField name="name" label="Promotion Name" autoComplete="off" />
              <Box sx={{ mt: 3, mb: 1 }}>
                <RHFSwitch
                  name="validUntil"
                  sx={{ mx: 0 }}
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2">Valid Until</Typography>
                    </>
                  }
                />
              </Box>
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDatePicker
                            label="Start Date"
                            inputFormat="dd/MM/yyyy"
                            value={field.value || null}
                            onChange={(newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <img src="/assets/calender-icon.svg" alt="icon" />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MobileDatePicker
                            label="End Date"
                            inputFormat="dd/MM/yyyy"
                            value={field.value || null}
                            disabled={!values.validUntil}
                            minDate={new Date(values.startDate)}
                            onChange={(newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <img src="/assets/calender-icon.svg" alt="icon" />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFDaySelect name="selectedDay" />
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="type"
                    label="Promotion Type"
                    placeholder="Promotion Type"
                    SelectProps={{ native: false }}
                  >
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

                    <MenuItem
                      value={1}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                      }}
                    >
                      Discount
                    </MenuItem>

                    <MenuItem
                      value={3}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                      }}
                    >
                      Bundle
                    </MenuItem>

                    {/* <MenuItem
                      value={2}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: "body2",
                      }}
                    >
                      Package
                    </MenuItem> */}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    {handleTypeLabel(values.type)}
                    {values.type === 3 && (
                      <>
                        <NumericFormat
                          customInput={RHFTextField}
                          name="qtyMin"
                          label="Qty Min Buy"
                          autoComplete="off"
                          decimalScale={2}
                          decimalSeparator="."
                          thousandSeparator=","
                          allowNegative={false}
                          value={getValues('qtyMin') === 0 ? '' : getValues('qtyMin')}
                          onValueChange={(values) => setValue('qtyMin', Number(values.value))}
                        />
                        <NumericFormat
                          customInput={RHFTextField}
                          name="qtyFree"
                          label="Qty Free"
                          autoComplete="off"
                          decimalScale={2}
                          decimalSeparator="."
                          thousandSeparator=","
                          allowNegative={false}
                          value={getValues('qtyFree') === 0 ? '' : getValues('qtyFree')}
                          onValueChange={(values) => setValue('qtyFree', Number(values.value))}
                        />
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              {values.type === 2 && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ mb: 1 }}>Image (max size: 900KB)</Typography>
                  <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
                </Box>
              )}
            </Stack>

            <Stack spacing={3} mt={2}>
              <Stack flexDirection="row" alignItems="center" gap={3}>
                <Typography variant="subtitle1">List of Products</Typography>
                <FormGroup>
                  <FormControlLabel control={<Checkbox onChange={handleAllProductsCheckbox} />} label="All Products" />
                </FormGroup>
              </Stack>

              {fields.map((field, index) => (
                <Stack key={field.id} flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
                  <RHFSelect
                    name={`products.${index}`}
                    SelectProps={{ native: false }}
                    onChange={(e) => handleProductsChange(e, index)}
                    required
                  >
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
                    {ctx.product.map((item, n) => (
                      <MenuItem
                        key={n}
                        value={item._id}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">{item.name}</Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  {fields.length !== 1 && (
                    <Stack alignItems="flex-end">
                      <Button
                        color="error"
                        variant="contained"
                        sx={{
                          boxShadow: '0',
                          p: 0,
                          minWidth: 30,
                          height: 30,
                          mb: 0.5,
                          bgcolor: '#FFC2B4',
                          color: 'red',
                          '&:hover': {
                            bgcolor: '#FFC2B4',
                          },
                        }}
                        size="large"
                        onClick={() => handleOptionRemove(index)}
                      >
                        <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                      </Button>
                    </Stack>
                  )}
                </Stack>
              ))}

              <Stack alignItems="center">
                <Button variant="text" onClick={handleProductAdd}>
                  <Iconify icon="eva:plus-fill" width={20} height={20} /> Add Product
                </Button>
              </Stack>

              {isEdit && (
                <Box sx={{ mt: 4 }}>
                  <RHFSwitch
                    name="isAvailable"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2">Promo still available ?</Typography>
                      </>
                    }
                    sx={{ mx: 0 }}
                  />
                </Box>
              )}

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.promotion)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={fields.length === 0}>
                  {!isEdit ? 'New Promotion' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
