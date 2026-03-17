import React, { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import SimpleMDE from 'react-simplemde-editor';
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
  Typography,
  TextField,
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

// axios
import axios from '../../../../utils/axios';

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadSingleFile,
  RHFSwitch,
} from '../../../../components/hook-form';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// context
import { mainContext } from '../../../../contexts/MainContext';

VoucherForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

const voucherTypeOpt = [
  { label: 'Diskon', value: 1 },
  { label: 'Hadiah', value: 2 },
  { label: "Postcard", value: 3 },
];

const optionsPostcard = [
  { label: 'Opsi 1', value: 'opsi 1' },
  { label: 'Opsi 2', value: 'opsi 2' },
  { label: 'Opsi 3', value: 'opsi 3' },
  { label: 'Opsi 4', value: 'opsi 4' },
  { label: 'Opsi 5', value: 'opsi 5' },
];

export default function VoucherForm({ currentData, isEdit }) {
  const navigate = useNavigate();
  const ctx = useContext(mainContext);
  const { enqueueSnackbar } = useSnackbar();

  const d = new Date();
  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required('Name is required'),
    start: Yup.string().required('Start Date is required'),
    end: Yup.string().required('End Date is required'),
    voucherType: Yup.number().moreThan(0, 'Voucher Type is required'),
    option: Yup.string().when('voucherType', {
      is: 3,
      then: Yup.string().required('Options is required'),
      otherwise: Yup.string().notRequired(),
    }),
    qtyProduct: Yup.number().when('voucherType', {
      is: 1,
      then: Yup.number().moreThan(0, 'Qty Product is required'),
      otherwise: Yup.number().notRequired(),
    }),
    worthPoint: Yup.number().moreThan(0, 'Worth Point is required'),
    product: Yup.array().when('voucherType', {
      is: 1,
      then: (schema) =>
        schema.of(Yup.string().required()).min(1, 'Minimal pilih 1 produk').required('Produk wajib dipilih'),
      otherwise: (schema) => schema.notRequired().default([]),
    }),
    description: Yup.string(),
    isLimited: Yup.boolean(),
    quota: Yup.number().when('isLimited', {
      is: true,
      then: Yup.number().moreThan(0, 'Quota is required'),
      otherwise: Yup.number().notRequired(),
    }),
    isAvailable: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
      start: currentData?.start || new Date(d.getFullYear(), d.getMonth(), d.getDate()),
      end: currentData?.end || new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()),
      voucherType: currentData?.voucherType || 1,
      option: currentData?.option || '',
      image: currentData?.image || '',
      product: Array.isArray(currentData?.product)
        ? currentData.product.map((p) => (typeof p === 'object' && p !== null ? String(p._id) : String(p)))
        : [],
      qtyProduct: currentData?.qtyProduct || 0,
      worthPoint: currentData?.worthPoint || 0,
      description: currentData?.description || '',
      isLimited: currentData?.isLimited ?? false,
      quota: currentData?.quota || 0,
      isAvailable: currentData?.isAvailable ?? true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { control, reset, watch, getValues, setValue, handleSubmit } = methods;

  const values = watch();

  const isAllSelected = useMemo(() => {
    return values?.product?.length === ctx?.product?.length;
  }, [values?.product, ctx.product]);

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

  const onSubmit = async () => {
    try {
      console.log(values.product);
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('voucherType', values.voucherType);
      formData.append('option', values.voucherType === 3 ? values.option : '');
      formData.append('worthPoint', values.worthPoint);
      formData.append('start', values.start);
      formData.append('end', values.end);
      formData.append('image', values.image);
      formData.append('qtyProduct', values.qtyProduct);
      formData.append('description', values.description);
      formData.append('isLimited', values.isLimited);
      formData.append('quota', values.quota);
      formData.append('isAvailable', isEdit ? values.isAvailable : true);

      const listProduct = values.product || [];
      if (values.voucherType === 1 && listProduct.length > 0) {
        formData.append('product', JSON.stringify(listProduct));
      } else if (isEdit) {
        formData.append('product', 'reset');
      }

      if (!isEdit) {
        await axios.post('/voucher', formData);
      } else {
        await axios.patch(`/voucher/${currentData._id}`, formData);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.library.voucher);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="name" label="Voucher Name" autoComplete="off" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack flexDirection="row" gap={3}>
                    <RHFSelect
                      name="voucherType"
                      label="Voucher Type"
                      placeholder="Voucher Type"
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
                      {voucherTypeOpt?.map((item, i) => (
                        <MenuItem
                          key={i}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                          }}
                          value={item?.value}
                          onClick={() => {
                            if (item?.value !== 1) {
                              setValue('qtyProduct', 0);
                            }
                          }}
                        >
                          {item?.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    {getValues('voucherType') === 3 && (
                      <RHFSelect
                        name="option"
                        label="Postcard Option"
                        placeholder="Postcard Option"
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
                        {optionsPostcard?.map((item, i) => (
                          <MenuItem
                            key={i}
                            sx={{
                              mx: 1,
                              my: 0.5,
                              borderRadius: 0.75,
                              typography: 'body2',
                            }}
                            value={item?.value}
                          >
                            {item?.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="Start Date"
                      inputFormat="dd/MM/yyyy"
                      value={values.start}
                      onChange={(newValue) => {
                        setValue('start', newValue);
                      }}
                      renderInput={(params) => (
                        <RHFTextField
                          {...params}
                          name="start"
                          fullWidth
                          InputProps={{
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="End Date"
                      inputFormat="dd/MM/yyyy"
                      value={values?.end}
                      onChange={(newValue) => {
                        setValue('end', newValue);
                      }}
                      renderInput={(params) => (
                        <RHFTextField
                          {...params}
                          name="end"
                          fullWidth
                          InputProps={{
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
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography sx={{ mb: 1 }}>Image (max size: 900KB)</Typography>
                <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack>
              <SimpleMDE value={values.description} onChange={(value) => setValue('description', value)} />
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <NumericFormat
                  customInput={RHFTextField}
                  name="worthPoint"
                  label="Worth Point"
                  autoComplete="off"
                  decimalScale={2}
                  decimalSeparator="."
                  thousandSeparator=","
                  allowNegative={false}
                  InputProps={{ endAdornment: <InputAdornment position="end">Point</InputAdornment> }}
                  value={getValues('worthPoint') === 0 ? '' : getValues('worthPoint')}
                  onValueChange={(values) => setValue('worthPoint', Number(values.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="qtyProduct"
                  label="Qty Product"
                  autoComplete="off"
                  value={getValues('qtyProduct') === 0 ? '' : getValues('qtyProduct')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ type: 'number' }}
                  onChange={(e) => setValue('qtyProduct', Number(e.target.value))}
                  disabled={values.voucherType !== 1}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack>
                  <Box>
                    <RHFSwitch
                      name="isLimited"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2">Limited voucher?</Typography>
                        </>
                      }
                      sx={{ mx: 0 }}
                    />
                  </Box>
                  <NumericFormat
                    customInput={RHFTextField}
                    name="quota"
                    label="Quota"
                    autoComplete="off"
                    decimalScale={2}
                    decimalSeparator="."
                    thousandSeparator=","
                    allowNegative={false}
                    disabled={!getValues('isLimited')}
                    value={getValues('quota') === 0 ? '' : getValues('quota')}
                    onValueChange={(values) => setValue('quota', Number(values.value))}
                  />
                </Stack>
              </Grid>

              {isEdit && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <RHFSwitch
                      name="isAvailable"
                      labelPlacement="start"
                      label={
                        <>
                          <Typography variant="subtitle2">Available</Typography>
                        </>
                      }
                      sx={{ mx: 0 }}
                    />
                  </Box>
                </Grid>
              )}

              {values.voucherType === 1 && (
                <Grid item xs={12} md={12}>
                  <Stack spacing={1}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isAllSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue(
                                  'product',
                                  ctx.product.map((p) => p._id)
                                );
                              } else {
                                setValue('product', []);
                              }
                            }}
                          />
                        }
                        label="All Products"
                      />
                    </FormGroup>

                    <Controller
                      name="product"
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
                            <TextField
                              {...params}
                              label="Select Products"
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Stack>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.voucher)}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                disabled={values.voucherType === 1 && values?.products?.length === 0 ? Boolean(true) : Boolean(false)}
              >
                {!isEdit ? 'New Voucher' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
