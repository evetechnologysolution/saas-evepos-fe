import React, { useCallback, useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

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
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadSingleFile,
  RHFSwitch,
} from "../../../../components/hook-form";
import Iconify from "../../../../components/Iconify";

// hook
import useResponsive from "../../../../hooks/useResponsive";

// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";

// context
import { mainContext } from "../../../../contexts/MainContext";

PromotionForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function PromotionForm({ currentData, isEdit }) {
  const navigate = useNavigate();

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required("Name is required"),
    type: Yup.number().moreThan(0, "Type is required"),
    amount: Yup.number().moreThan(0, "Amount is required"),
    startDate: Yup.date().required("End Date is required").nullable(),
    endDate: Yup.date().when("validUntil", {
      is: true,
      then: (schema) => schema.required("End Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }).nullable(),
    validUntil: Yup.bool(),
    products: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id,
      name: currentData?.name || "",
      type: currentData?.type || 1,
      amount: currentData?.amount || 0,
      startDate: currentData?.startDate || new Date(),
      endDate: currentData?.endDate || null,
      validUntil: currentData?.validUntil || false,
      isAvailable: currentData?.isAvailable || false,
      image: currentData?.image || "",
      products: currentData?.products || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { control, reset, watch, getValues, setValue, clearErrors, handleSubmit } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const values = watch();

  const ctx = useContext(mainContext);

  const [productList, setProductList] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleProductAdd = () => {
    setProductList([...productList, ""]);
  };

  const handleOptionRemove = (index) => {
    const list = [...productList];
    list.splice(index, 1);
    setProductList(list);
  };

  const handleProductsChange = (e, index) => {
    const { value } = e.target;
    const list = [...productList];
    list[index] = value;
    setProductList(list);
  };

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
      setProductList(currentData?.products);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  useEffect(() => {
    if (!values.validUntil) {
      setValue("endDate", null);
      clearErrors("endDate");
    }
  }, [values.validUntil]);

  const handleTypeLabel = (type) => {
    if (type === 1) {
      return (
        <RHFTextField
          name="amount"
          label="Discount"
          autoComplete="off"
          value={getValues("amount") === 0 ? "" : getValues("amount")}
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>, type: "number" }}
          onChange={(e) => setValue("amount", Number(e.target.value))}
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
          value={getValues("amount") === 0 ? "" : getValues("amount")}
          onValueChange={(values) => setValue("amount", Number(values.value))}
        />
      );
    }

    return <RHFTextField name="amount" label="Amount" autoComplete="off" disabled />;
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("amount", values.amount);
      formData.append("startDate", values.startDate || "");
      formData.append("endDate", values.endDate || "");
      formData.append("validUntil", values.validUntil);
      formData.append("image", values.image);
      formData.append("products", JSON.stringify(productList));
      formData.append("isAvailable", isEdit ? values.isAvailable : true);
      if (!isEdit) {
        await ctx.createPromotion(formData);
      } else {
        await ctx.updatePromotion(currentData._id, formData);
      }
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_DASHBOARD.library.promotion);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }

  };

  const isMobile = useResponsive("down", "lg");

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                        typography: "body2",
                        fontStyle: "italic",
                        color: "text.secondary",
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
                        typography: "body2",
                      }}
                    >
                      Discount
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
                  {handleTypeLabel(values.type)}
                </Grid>
              </Grid>
              {values.type === 2 && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ mb: 1 }}>Image (max size: 900KB)</Typography>
                  <RHFUploadSingleFile name="image" accept="image/*" maxSize={900000} onDrop={handleDrop} />
                </Box>
              )}

              {isEdit && (
                <Box sx={{ mt: 4 }}>
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
              )}
            </Stack>
            {/* </Grid>
          <Grid item xs={12} md={6}> */}
            <Stack spacing={3} mt={2}>
              <Stack flexDirection="row" alignItems="center" gap={3}>
                <Typography variant="subtitle1"> List of Products</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProductList(ctx?.product?.map(row => row?._id) || [""])
                          } else {
                            setProductList([""]);
                          }
                        }}
                      />
                    }
                    label="All Products" />
                </FormGroup>
              </Stack>
              {productList?.map((product, index) => (
                <Stack
                  key={index}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <RHFSelect
                    name={`product${index}`}
                    SelectProps={{ native: false }}
                    onChange={(e) => handleProductsChange(e, index)}
                    value={product}
                    required
                  >
                    <MenuItem
                      value=""
                      sx={{
                        mx: 1,
                        borderRadius: 0.75,
                        typography: "body2",
                        fontStyle: "italic",
                        color: "text.secondary",
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
                          typography: "body2",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2">{item.name}</Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  {productList?.length !== 1 && (
                    <Stack alignItems="flex-end">
                      <Button
                        color="error"
                        variant="contained"
                        sx={{
                          boxShadow: "0", p: 0, minWidth: 30, height: 30, mb: 0.5, bgcolor: "#FFC2B4", color: "red",
                          "&:hover": {
                            bgcolor: "#FFC2B4"
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

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.promotion)}>Cancel</Button>
                <LoadingButton type="submit" variant="contained" loading={loading} disabled={productList?.length > 0 ? Boolean(false) : Boolean(true)}>
                  {!isEdit ? "New Promotion" : "Save Changes"}
                </LoadingButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider >
  );
}
