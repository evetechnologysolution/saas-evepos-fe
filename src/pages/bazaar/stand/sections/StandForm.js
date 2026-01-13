import React, { useMemo, useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { LoadingButton } from "@mui/lab";

// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// axios
import axios from "../../../../utils/axios";

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFSwitch,
} from "../../../../components/hook-form";

// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";

StandForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

const standType = [
  { name: "Booth UMKM", value: "umkm" },
  { name: "Games Area", value: "games area" },
  { name: "Stage Area", value: "stage area" },
  { name: "Lapangan Futsal", value: "lapangan futsal" },
  { name: "Bonus QR", value: "bonus qr" },
];

export default function StandForm({ currentData, isEdit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const NewDataSchema = Yup.object().shape({
    id: Yup.string(),
    satndId: Yup.string(),
    name: Yup.string().required("Name is required"),
    standType: Yup.string().required("Stand Type is required"),
    point: Yup.number().moreThan(0, "Worth Point is required"),
    isAvailable: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentData?._id || "",
      standId: currentData?.standId || "",
      name: currentData?.name || "",
      standType: currentData?.standType || "",
      point: currentData?.point || 0,
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
      const objData = {
        ...values,
        isAvailable: isEdit ? values.isAvailable : true
      }
      setLoading(true);
      if (!isEdit) {
        await axios.post("/bazaar/stand", objData);
      } else {
        await axios.patch(`/bazaar/stand/${currentData._id}`, objData);
      }
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      navigate(PATH_DASHBOARD.bazaar.stand);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error?.message || "Gagal simpan!", { variant: "error" });
      console.error(error);
    }

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {isEdit && (
                <RHFTextField name="standId" label="Stand ID" disabled />
              )}
              <RHFTextField name="name" label="Stand Name" autoComplete="off" value={getValues("name")?.toUpperCase() || ""} />
              <RHFSelect
                name="standType"
                label="Stand Type"
                placeholder="Stand Type"
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
                {standType.map((item, i) => (
                  <MenuItem
                    key={i}
                    value={item?.value}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: "body2",
                    }}
                  >
                    {item?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <NumericFormat
                customInput={RHFTextField}
                name="point"
                label="Worth Point"
                autoComplete="off"
                decimalScale={2}
                decimalSeparator="."
                thousandSeparator=","
                allowNegative={false}
                InputProps={{ endAdornment: <InputAdornment position="end">Point</InputAdornment> }}
                value={getValues("point") === 0 ? "" : getValues("point")}
                onValueChange={(values) => setValue("point", Number(values.value))}
              />
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
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.bazaar.stand)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {!isEdit ? "New Stand" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider >
  );
}
