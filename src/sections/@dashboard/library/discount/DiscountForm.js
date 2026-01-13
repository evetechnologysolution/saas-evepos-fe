import * as Yup from "yup";
import { useEffect, useMemo, useContext } from "react";
import { useSnackbar } from "notistack";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// @mui
import { LoadingButton } from "@mui/lab";
import {
    Alert,
    Button,
    Card,
    Grid,
    Stack,
    InputAdornment,
    Typography
} from "@mui/material";
// context
import { cashierContext } from "../../../../contexts/CashierContext";
// components
import { FormProvider, RHFTextField } from "../../../../components/hook-form";

// ----------------------------------------------------------------------

export default function DiscountForm() {
    const ctx = useContext(cashierContext);

    const { enqueueSnackbar } = useSnackbar();

    const DataSchema = Yup.object().shape({
        start: Yup.string(),
        end: Yup.string(),
        amount: Yup.number().required(),
    });

    const defaultValues = useMemo(
        () => ({
            start: ctx.globalDisc?.start || "",
            end: ctx.globalDisc?.end || "",
            amount: ctx.globalDisc?.amount || 0
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ctx.globalDisc]
    );

    const methods = useForm({
        resolver: yupResolver(DataSchema),
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

    useEffect(() => {
        if (ctx.globalDisc) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.globalDisc]);

    const onSubmit = async () => {
        try {
            const objData = {
                start: values.start,
                end: values.end,
                amount: Number(values.amount)
            };
            await ctx.updateGlobalDisc(objData);
            enqueueSnackbar("Update success!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            <Typography variant="subtitle1">This form is used to set global discounts that will be displayed on the order page of the website.</Typography>
                        </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
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
                            <RHFTextField
                                name="amount"
                                label="Percentage"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    inputProps: { min: 1, max: 100 }
                                }}
                                type="number"
                                autoComplete="off"
                                required
                                value={getValues("amount") === 0 ? "" : getValues("amount")}
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" mt={5} gap={1}>
                            <Button variant="outlined" onClick={() => reset(defaultValues)}>Cancel</Button>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Update
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider >
    );
}
