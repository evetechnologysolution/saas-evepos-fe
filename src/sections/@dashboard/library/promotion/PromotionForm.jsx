import React, { useCallback, useMemo, useEffect, useContext } from 'react';
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
  Autocomplete,
  Chip,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

// form
import { useForm, Controller } from 'react-hook-form';
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
      conditional: {
        label: currentData?.conditional?.label ?? '',
        notes: currentData?.conditional?.notes ?? '',
        otherNotes: currentData?.conditional?.otherNotes ?? '',
        isActive: currentData?.conditional?.isActive ?? false,
      },
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

  const { enqueueSnackbar } = useSnackbar();

  const values = watch();

  const ctx = useContext(mainContext);

  const isAllSelected = useMemo(() => {
    return values?.products?.length === ctx?.product?.length;
  }, [values?.products, ctx.product]);

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

      formData.append('conditional.label', Number(data.type) === 1 ? data.conditional.label : '');
      formData.append('conditional.notes', Number(data.type) === 1 ? data.conditional.notes : '');
      formData.append('conditional.otherNotes', Number(data.type) === 1 ? data.conditional.otherNotes : '');
      formData.append('conditional.isActive', Number(data.type) === 1 ? data.conditional.isActive : false);

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
            <Stack sx={{ mb: isMobile && 2 }} spacing={3}>
              <RHFTextField name="name" label="Promotion Name" autoComplete="off" />
              <Box>
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

              <Box>
                <Grid container spacing={3}>
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
                    <Stack flexDirection="row" gap={3}>
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
              </Box>

              {values.type === 1 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box mb={1}>
                        <RHFSwitch
                          name="conditional.isActive"
                          sx={{ mx: 0 }}
                          labelPlacement="start"
                          label={
                            <>
                              <Typography variant="subtitle2">Promotion Condition</Typography>
                            </>
                          }
                        />
                      </Box>
                      <RHFTextField name="conditional.label" label="Conditional Label" autoComplete="off" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name="conditional.notes"
                        label="Conditional Notes"
                        autoComplete="off"
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <RHFTextField
                        name="conditional.otherNotes"
                        label="Conditional Warning"
                        autoComplete="off"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {values.type === 2 && (
                <Box>
                  <Typography sx={{ mb: 1 }}>Image (max size: 900KB)</Typography>
                  <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
                </Box>
              )}
            </Stack>

            <Stack spacing={1} mt={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(
                            'products',
                            ctx.product.map((p) => p._id)
                          );
                        } else {
                          setValue('products', []);
                        }
                      }}
                    />
                  }
                  label="All Products"
                />
              </FormGroup>

              <Controller
                name="products"
                control={control}
                defaultValue={[]}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    disableCloseOnSelect
                    options={ctx.product || []}
                    value={(ctx.product || []).filter((option) => field.value?.includes(option._id))}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, newValue) => field.onChange(newValue.map((item) => item._id))}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Products" error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />

              {isEdit && (
                <Box sx={{ mt: 3 }}>
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

              <Stack direction="row" justifyContent="flex-end" sx={{ pt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.promotion)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={values?.products?.length === 0}
                >
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
