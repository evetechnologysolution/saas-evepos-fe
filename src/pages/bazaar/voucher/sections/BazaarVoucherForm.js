import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import SimpleMDE from "react-simplemde-editor";
// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// axios
import axios from "../../../../utils/axios";

// components
import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFSwitch,
} from "../../../../components/hook-form";

// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";

BazaarVoucherForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

export default function BazaarVoucherForm({ currentData, isEdit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const d = new Date();
  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required("Name is required"),
    start: Yup.string().required("Start Date is required"),
    end: Yup.string().required("End Date is required"),
    voucherType: Yup.number().moreThan(0, "Voucher Type is required"),
    qtyProduct: Yup.number()
      .when("voucherType", {
        is: 1,
        then: Yup.number().moreThan(0, "Qty Product is required"),
        otherwise: Yup.number().notRequired(),
      }),
    worthPoint: Yup.number().moreThan(0, "Worth Point is required"),
    product: Yup.array(),
    description: Yup.string(),
    isLimited: Yup.boolean(),
    quota: Yup.number()
      .when("isLimited", {
        is: true,
        then: Yup.number().moreThan(0, "Quota is required"),
        otherwise: Yup.number().notRequired(),
      }),
    isBazaar: Yup.boolean(),
    isAvailable: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || "",
      name: currentData?.name || "",
      start: currentData?.start || new Date(d.getFullYear(), d.getMonth(), d.getDate()),
      end: currentData?.end || new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()),
      voucherType: currentData?.voucherType || 2, // hadiah
      image: currentData?.image || "",
      product: currentData?.product || [],
      qtyProduct: currentData?.qtyProduct || 0,
      worthPoint: currentData?.worthPoint || 0,
      description: currentData?.description || "",
      isLimited: currentData?.isLimited || false,
      quota: currentData?.quota || 0,
      isBazaar: currentData?.isBazaar || true,
      isAvailable: currentData?.isAvailable || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDataSchema),
    defaultValues,
  });

  const { reset, watch, getValues, setValue, handleSubmit } = methods;

  const values = watch();

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
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("voucherType", 2); // hadiah
      formData.append("worthPoint", values.worthPoint);
      formData.append("start", values.start);
      formData.append("end", values.end);
      formData.append("image", values.image);
      formData.append("qtyProduct", 0);
      formData.append("description", values.description);
      formData.append("isLimited", values.isLimited);
      formData.append("quota", values.quota);
      formData.append("isBazaar", true);
      formData.append("isAvailable", isEdit ? values.isAvailable : true);


      if (!isEdit) {
        await axios.post("/vouchers", formData);
      } else {
        await axios.patch(`/vouchers/${currentData._id}`, formData);
      }
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_DASHBOARD.bazaar.voucher);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="name" label="Voucher Name" autoComplete="off" />
                </Grid>
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
                    value={getValues("worthPoint") === 0 ? "" : getValues("worthPoint")}
                    onValueChange={(values) => setValue("worthPoint", Number(values.value))}
                  />
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
                        setValue("start", newValue);
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
                        setValue("end", newValue);
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
              <SimpleMDE value={values.description} onChange={(value) => setValue("description", value)} />
            </Stack>
            <Grid container spacing={3}>
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
                    disabled={!getValues("isLimited")}
                    value={getValues("quota") === 0 ? "" : getValues("quota")}
                    onValueChange={(values) => setValue("quota", Number(values.value))}
                  />
                </Stack>
              </Grid>

              {isEdit && (
                <Grid item xs={12} md={12}>
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
            </Grid>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.bazaar.voucher)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {!isEdit ? "New Voucher" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card >
    </FormProvider >
  );
}
