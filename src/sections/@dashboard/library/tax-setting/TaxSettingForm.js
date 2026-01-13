import * as Yup from 'yup';
import { useEffect, useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Card,
    Grid,
    Stack,
    Typography,
    InputAdornment,
    FormControlLabel,
    Checkbox
} from '@mui/material';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
// components
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function TaxSettingForm() {
    const ctx = useContext(cashierContext);

    const { enqueueSnackbar } = useSnackbar();

    const DataSchema = Yup.object().shape({
        taxPercentageActive: Yup.boolean(),
        taxOrderType1: Yup.boolean(),
        taxOrderType2: Yup.boolean(),
        servicePercentageActive: Yup.boolean(),
        serviceOrderType1: Yup.boolean(),
        serviceOrderType2: Yup.boolean(),
    });

    const defaultValues = useMemo(
        () => ({
            taxPercentageActive: ctx.taxSetting?.tax?.isActive || false,
            taxPercentage: ctx.taxSetting?.tax?.percentage || 0,
            taxOrderType1: ctx.taxSetting?.tax?.orderType?.includes('onsite') || false,
            taxOrderType2: ctx.taxSetting?.tax?.orderType?.includes('delivery') || false,
            servicePercentageActive: ctx.taxSetting?.serviceCharge?.isActive || false,
            servicePercentage: ctx.taxSetting?.serviceCharge?.percentage || 0,
            serviceOrderType1: ctx.taxSetting?.serviceCharge?.orderType?.includes('onsite') || false,
            serviceOrderType2: ctx.taxSetting?.serviceCharge?.orderType?.includes('delivery') || false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ctx.taxSetting]
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
        if (ctx.taxSetting) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.taxSetting]);

    const onSubmit = async () => {
        try {
            const taxOrderType = []
            if (values.taxOrderType1) {
                taxOrderType.push("onsite");
            }
            if (values.taxOrderType2) {
                taxOrderType.push("delivery");
            }

            const serviceOrderType = []
            if (values.serviceOrderType1) {
                serviceOrderType.push("onsite");
            }
            if (values.serviceOrderType2) {
                serviceOrderType.push("delivery");
            }

            const objData = {
                tax: {
                    isActive: values.taxPercentageActive,
                    percentage: Number(values.taxPercentage),
                    orderType: taxOrderType
                },
                serviceCharge: {
                    isActive: values.servicePercentageActive,
                    percentage: Number(values.servicePercentage),
                    orderType: serviceOrderType
                }
            };
            await ctx.updateTaxSetting(objData);
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <RHFSwitch
                                name="taxPercentageActive"
                                labelPlacement="start"
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Tax
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            For activating tax
                                        </Typography>
                                    </>
                                }
                                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                            />
                            <RHFTextField
                                name="taxPercentage"
                                label="Percentage"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    inputProps: { min: 1, max: 100 }
                                }}
                                type="number"
                                autoComplete="off"
                                disabled={values.taxPercentageActive ? Boolean(false) : Boolean(true)}
                                required={values.taxPercentageActive ? Boolean(true) : Boolean(false)}
                                value={getValues("taxPercentage") === 0 ? "" : getValues("taxPercentage")}
                            />
                            <Stack>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Choose Order Type
                                </Typography>
                                <Stack flexDirection={{ xs: "column", sm: "row" }} gap={{ xs: 0, sm: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Onsite"
                                        onChange={(e) => setValue("taxOrderType1", Boolean(e.target.checked))}
                                        checked={getValues("taxOrderType1")}
                                        disabled={values.taxPercentageActive ? Boolean(false) : Boolean(true)}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Delivery"
                                        onChange={(e) => setValue("taxOrderType2", Boolean(e.target.checked))}
                                        checked={getValues("taxOrderType2")}
                                        disabled={values.taxPercentageActive ? Boolean(false) : Boolean(true)}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <RHFSwitch
                                name="servicePercentageActive"
                                labelPlacement="start"
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Service Charge
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            For activating service charge
                                        </Typography>
                                    </>
                                }
                                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                            />
                            <RHFTextField
                                name="servicePercentage"
                                label="Percentage"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    inputProps: { min: 1, max: 100 }
                                }}
                                type="number"
                                autoComplete="off"
                                disabled={values.servicePercentageActive ? Boolean(false) : Boolean(true)}
                                required={values.servicePercentageActive ? Boolean(true) : Boolean(false)}
                                value={getValues("servicePercentage") === 0 ? "" : getValues("servicePercentage")}
                            />
                            <Stack>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Choose Order Type
                                </Typography>
                                <Stack flexDirection={{ xs: "column", sm: "row" }} gap={{ xs: 0, sm: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Onsite"
                                        onChange={(e) => setValue("serviceOrderType1", Boolean(e.target.checked))}
                                        checked={getValues("serviceOrderType1")}
                                        disabled={values.servicePercentageActive ? Boolean(false) : Boolean(true)}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Delivery"
                                        onChange={(e) => setValue("serviceOrderType2", Boolean(e.target.checked))}
                                        checked={getValues("serviceOrderType2")}
                                        disabled={values.servicePercentageActive ? Boolean(false) : Boolean(true)}
                                    />
                                </Stack>
                            </Stack>
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
