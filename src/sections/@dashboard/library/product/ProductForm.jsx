/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  styled,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  MenuItem,
  Divider,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Box,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
// routes
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadSingleFile,
  RHFSwitch,
} from '../../../../components/hook-form';
// context
import { mainContext } from '../../../../contexts/MainContext';
import schema from '../../../../pages/library/product/schema';
import useProduct from '../../../../pages/library/product/service/useProduct';
// ----------------------------------------------------------------------

ProductForm.propTypes = {
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

export default function ProductForm({ isEdit, currentData }) {
  const navigate = useNavigate();
  const { create, update, list } = useProduct();

  const ctx = useContext(mainContext);

  const { enqueueSnackbar } = useSnackbar();

  const { data: selectedList, isLoading } = list({
    page: 1,
    perPage: 100,
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || '',
      name: currentData?.name || '',
      image: currentData?.image || '',
      price: currentData?.price || 0,
      description: currentData?.description || '',
      productionPrice: currentData?.productionPrice || 0,
      productionNotes: currentData?.productionNotes || '',
      category: currentData?.category || null,
      subcategory: currentData?.subcategory || null,
      unit: currentData?.unit || 'pcs',
      listNumber: currentData?.listNumber || '',
      extraNotes: currentData?.extraNotes || false,
      isRecommended: currentData?.isRecommended || false,
      isAvailable: currentData?.isAvailable || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const defaultVariant = { variantRef: '', isMandatory: true, isMultiple: false };

  const [variantList, setVariantList] = useState([]);

  const handleVariantChange = (e, index) => {
    const { value } = e.target;
    const list = [...variantList];
    list[index] = Object.assign(list[index], { variantRef: value });
    setVariantList(list);
  };

  const handleVariantMandatory = (value, index) => {
    const list = [...variantList];
    list[index] = Object.assign(list[index], { isMandatory: value });
    setVariantList(list);
  };

  const handleVariantMultiple = (value, index) => {
    const list = [...variantList];
    list[index] = Object.assign(list[index], { isMultiple: value });
    setVariantList(list);
  };

  const handleVariantAdd = () => {
    setVariantList([...variantList, defaultVariant]);
  };

  const handleOptionRemove = (index) => {
    const list = [...variantList];
    list.splice(index, 1);
    setVariantList(list);
  };

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
      setVariantList(currentData?.variant);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // field dasar
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('productionPrice', data.productionPrice);
      formData.append('productionNotes', data.productionNotes || '');
      formData.append('description', data.description || '');
      formData.append('unit', data.unit);

      // relasi
      formData.append('category', data.category || '');
      formData.append('subcategory', data.subcategory || '');

      // boolean
      formData.append('isAvailable', data.isAvailable);
      formData.append('extraNotes', data.extraNotes);
      formData.append('isRecommended', data.isRecommended);

      // number
      formData.append('listNumber', Number(data.listNumber));

      // variant => stringify, karena form-data tidak bisa array object langsung
      formData.append('variantString', JSON.stringify(variantList || []));

      // image (string URL / File / null)
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      // create atau update
      const mutation = isEdit
        ? update.mutateAsync({ id: currentData._id, payload: formData })
        : create.mutateAsync(formData);

      await handleMutationFeedback(mutation, {
        successMsg: isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!',
        errorMsg: 'Gagal menyimpan produk!',
        onSuccess: () => navigate('/dashboard/library/product'),
        enqueueSnackbar,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {isEdit && <RHFTextField name="id" label="Product ID" disabled />}
              <RHFTextField name="name" label="Product Name" autoComplete="off" />
              <NumericFormat
                customInput={RHFTextField}
                name="price"
                label="Price"
                autoComplete="off"
                decimalScale={2}
                decimalSeparator="."
                thousandSeparator=","
                allowNegative={false}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
                value={getValues('price') === 0 ? '' : getValues('price')}
                onValueChange={(values) => {
                  setValue('price', Number(values.value));
                }}
              />
              {/* <div>
                <Typography sx={{ mb: 1 }}>Description</Typography>
                <RHFEditor simple name="description" />
              </div> */}
              <RHFTextField name="description" label="Description" autoComplete="off" multiline rows={5} />
              <div>
                <Typography sx={{ mb: 1 }}>Image (max size: 900KB)</Typography>
                <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <RHFSelect
                name="category"
                label="Category"
                placeholder="Category"
                // InputLabelProps={{ shrink: true }}
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
                {ctx?.category?.map((item, n) => (
                  <MenuItem
                    key={n}
                    value={item?._id}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                name="subcategory"
                label="Subcategory"
                placeholder="Subcategory"
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
                {ctx?.subcategory?.map((item, n) => (
                  <MenuItem
                    key={n}
                    value={item?._id}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <NumericFormat
                customInput={RHFTextField}
                name="productionPrice"
                label="Production Cost"
                autoComplete="off"
                decimalScale={2}
                decimalSeparator="."
                thousandSeparator=","
                allowNegative={false}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
                value={getValues('productionPrice') === 0 ? '' : getValues('productionPrice')}
                onValueChange={(values) => {
                  setValue('productionPrice', Number(values.value));
                }}
              />

              {/* <RHFTextField name="productionNotes" label="Production Notes" autoComplete="off" multiline rows={5} /> */}

              <RHFSelect name="unit" label="Unit" placeholder="Unit" SelectProps={{ native: false }}>
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
                {['pcs', 'kg', 'm2', 'cup'].map((item, n) => (
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

              <div>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  List Number
                </Typography>
                {isLoading ? (
                  <Box>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Stack display="grid" gap={1} gridTemplateColumns="repeat(auto-fit, 80px)">
                    {Array.from({ length: 50 }).map((_, n) => (
                      <Button
                        key={n}
                        variant={values.listNumber === n + 1 ? 'contained' : 'outlined'}
                        sx={{ height: 50 }}
                        onClick={() => setValue('listNumber', n + 1)}
                        disabled={
                          selectedList?.docs?.some((item) => item?.listNumber === n + 1) &&
                          currentData?.listNumber !== n + 1
                            ? Boolean(true)
                            : Boolean(false)
                        }
                      >
                        {n + 1}
                      </Button>
                    ))}
                  </Stack>
                )}
              </div>

              <Typography variant="subtitle1">List of Variant</Typography>
              {ctx.variant?.length === 0 && <CircularProgress />}
              {ctx.variant?.length > 0 &&
                variantList?.map((variant, index) => (
                  <Stack key={index} flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
                    <RHFSelect
                      name={`variant${index}`}
                      SelectProps={{ native: false }}
                      onChange={(e) => handleVariantChange(e, index)}
                      value={variant?.variantRef || ''}
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
                      {ctx.variant.map((item, n) => (
                        <MenuItem
                          key={n}
                          value={item._id}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                          }}
                          disabled={variantList.some((v) => v.variantRef === item._id)}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">{item.name}</Typography>
                            <Typography variant="body2" color="primary">
                              {item.options.map((field, i) => (
                                <span key={i}>
                                  {field.name}
                                  {item.options.length > 1 && i !== item.options.length - 1 && ', '}
                                </span>
                              ))}
                            </Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <FormControlLabel
                      name={`isRequired[${index}]`}
                      labelPlacement="start"
                      sx={{ mx: 0, width: 0.5, justifyContent: 'space-between' }}
                      control={
                        <CustomSwitch
                          checked={Boolean(variant.isMandatory)}
                          onChange={(e) => handleVariantMandatory(e.target.checked, index)}
                        />
                      }
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Mandatory
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Enable for mandatory
                          </Typography>
                        </>
                      }
                    />
                    <FormControlLabel
                      name={`isMultiple[${index}]`}
                      labelPlacement="start"
                      sx={{ mx: 0, width: 0.5, justifyContent: 'space-between' }}
                      control={
                        <CustomSwitch
                          checked={Boolean(variant.isMultiple)}
                          onChange={(e) => handleVariantMultiple(e.target.checked, index)}
                        />
                      }
                      label={
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Multiple Select
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Enable for multiple
                          </Typography>
                        </>
                      }
                    />
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
                  </Stack>
                ))}
              <Stack alignItems="flex-end">
                <Button variant="text" onClick={handleVariantAdd} disabled={ctx.variant?.length === 0}>
                  <Iconify icon="eva:plus-fill" width={20} height={20} /> Add Variant
                </Button>
              </Stack>

              <RHFSwitch
                name="extraNotes"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Extra Notes
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Turn off if the product has no extra notes
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              <RHFSwitch
                name="isRecommended"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Recommended
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Enable this if the product is recommended
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {isEdit && (
                <RHFSwitch
                  name="isAvailable"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Available
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disable this if the product is out of stock
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />
              )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.product)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'New Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
