import { useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import { NumericFormat } from 'react-number-format';
// form
import { useForm, Controller } from "react-hook-form";
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
    Typography,
    TextField
} from "@mui/material";
// components
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
// utils
import { handleMutationFeedback } from '../../../../utils/mutationfeedback';
// service
import schema from '../../../../pages/library/discount/schema/deliveryDiscount';
import useDisc from '../../../../pages/library/discount/service/useDeliveryDisc';

// ----------------------------------------------------------------------

export default function DeliveryDiscountForm() {
    const { enqueueSnackbar } = useSnackbar();
    const { getAll, update } = useDisc();

    const { data: initialData } = getAll();

    const defaultValues = useMemo(
        () => ({
            start: initialData?.start || null,
            end: initialData?.end || null,
            amount: initialData?.amount || null
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialData]
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
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (initialData) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const onSubmit = async () => {
        try {
            const objData = {
                start: values.start,
                end: values.end,
                amount: Number(values.amount)
            };
            const mutation = update.mutateAsync(objData);
            await handleMutationFeedback(mutation, {
                successMsg: 'Diskon berhasil disimpan!',
                errorMsg: 'Gagal menyimpan diskon!',
                onSuccess: () => null,
                enqueueSnackbar,
            });
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
                            <Typography variant="subtitle1">This form is used to set delivery discounts that will be displayed on the order page of the website.</Typography>
                        </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="start"
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
                                        name="end"
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
                            <NumericFormat
                                customInput={RHFTextField}
                                name="amount"
                                label="Discount Price"
                                autoComplete="off"
                                decimalScale={2}
                                decimalSeparator="."
                                thousandSeparator=","
                                allowNegative={false}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                                value={(getValues('amount') === 0 || getValues('amount') === null) ? '' : getValues('amount')}
                                onValueChange={(values) => {
                                    setValue('amount', values.value ? Number(values.value) : null);
                                }}
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
