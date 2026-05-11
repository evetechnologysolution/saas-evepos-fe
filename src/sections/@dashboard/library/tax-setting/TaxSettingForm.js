import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
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
    Checkbox,
    TextField,
    Autocomplete,
    Chip
} from '@mui/material';

// components
import { FormProvider, RHFSwitch, RHFNumericFormat } from '../../../../components/hook-form';

// schema & service
import schema from '../../../../pages/setting/tax/schema';
import useTaxSetting from '../../../../pages/setting/tax/service/useTaxSetting';
import useOutlet from '../../../../pages/outlet/service/useOutlet';

// ----------------------------------------------------------------------

const orderTypeOptions = [
    {
        label: 'Onsite',
        value: 'onsite',
    },
    {
        label: 'Delivery',
        value: 'delivery',
    },
];

export default function TaxSettingForm() {

    const { enqueueSnackbar } = useSnackbar();

    const { list: listOulet } = useOutlet();

    const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
        page: 1,
        perPage: 10,
    });

    const { getDataSetting, update } = useTaxSetting();

    const { data: dataSetting } = getDataSetting({
        byOutlet: 'none',
    });

    const defaultValues = useMemo(
        () => ({
            outletRef: dataSetting?.outletRef || [],

            tax: {
                isActive: dataSetting?.tax?.isActive ?? false,
                percentage: dataSetting?.tax?.percentage || 0,
                orderType: dataSetting?.tax?.orderType || [],
            },

            serviceCharge: {
                isActive: dataSetting?.serviceCharge?.isActive ?? false,
                percentage: dataSetting?.serviceCharge?.percentage || 0,
                orderType: dataSetting?.serviceCharge?.orderType || [],
            },
        }),
        [dataSetting]
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
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (dataSetting) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSetting]);

    const onSubmit = async (formData) => {
        try {
            const objData = {
                outletRef: formData.outletRef,

                tax: {
                    isActive: formData.tax.isActive,
                    percentage: Number(formData.tax.percentage),
                    orderType: formData.tax.orderType,
                },

                serviceCharge: {
                    isActive: formData.serviceCharge.isActive,
                    percentage: Number(formData.serviceCharge.percentage),
                    orderType: formData.serviceCharge.orderType,
                },
            };

            await update.mutateAsync(objData);

            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Controller
                                name="outletRef"
                                control={control}
                                defaultValue={[]}
                                render={({ field, fieldState: { error } }) => (
                                    <Autocomplete
                                        multiple
                                        filterSelectedOptions
                                        options={dataOulet?.docs || []}
                                        value={dataOulet?.docs?.filter((option) => field.value?.includes(option._id)) || []}
                                        getOptionLabel={(option) => option.name || ''}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        onChange={(event, newValue) => field.onChange(newValue.map((item) => item._id))}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Pilih Outlet" error={!!error} helperText={error?.message} />
                                        )}
                                    />
                                )}
                            />

                        </Stack>
                    </Grid>
                    {/* TAX */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <RHFSwitch
                                name="tax.isActive"
                                labelPlacement="start"
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Tax
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            For activating tax
                                        </Typography>
                                    </>
                                }
                                sx={{
                                    mx: 0,
                                    width: 1,
                                    justifyContent: 'space-between',
                                }}
                            />

                            <RHFNumericFormat
                                name="tax.percentage"
                                label="Percentage"
                                autoComplete="off"
                                thousandSeparator=","
                                decimalScale={2}
                                allowNegative={false}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                max={100}
                                disabled={!values?.tax?.isActive}
                                required={values?.tax?.isActive}
                            />

                            <Controller
                                name="tax.orderType"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Choose Order Type
                                        </Typography>

                                        <Stack
                                            flexDirection={{
                                                xs: 'column',
                                                sm: 'row',
                                            }}
                                            gap={{ xs: 0, sm: 2 }}
                                        >
                                            {orderTypeOptions.map((item) => (
                                                <FormControlLabel
                                                    key={item.value}
                                                    label={item.label}
                                                    disabled={!values?.tax?.isActive}
                                                    control={
                                                        <Checkbox
                                                            checked={field.value?.includes(item.value)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    field.onChange([
                                                                        ...field.value,
                                                                        item.value,
                                                                    ]);
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter(
                                                                            (val) => val !== item.value
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>
                                )}
                            />
                        </Stack>
                    </Grid>

                    {/* SERVICE CHARGE */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <RHFSwitch
                                name="serviceCharge.isActive"
                                labelPlacement="start"
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Service Charge
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            For activating service charge
                                        </Typography>
                                    </>
                                }
                                sx={{
                                    mx: 0,
                                    width: 1,
                                    justifyContent: 'space-between',
                                }}
                            />

                            <RHFNumericFormat
                                name="serviceCharge.percentage"
                                label="Percentage"
                                autoComplete="off"
                                thousandSeparator=","
                                decimalScale={2}
                                allowNegative={false}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                max={100}
                                disabled={!values?.serviceCharge?.isActive}
                                required={values?.serviceCharge?.isActive}
                            />

                            <Controller
                                name="serviceCharge.orderType"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Choose Order Type
                                        </Typography>

                                        <Stack
                                            flexDirection={{
                                                xs: 'column',
                                                sm: 'row',
                                            }}
                                            gap={{ xs: 0, sm: 2 }}
                                        >
                                            {orderTypeOptions.map((item) => (
                                                <FormControlLabel
                                                    key={item.value}
                                                    label={item.label}
                                                    disabled={!values?.tax?.isActive}
                                                    control={
                                                        <Checkbox
                                                            checked={field.value?.includes(item.value)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    field.onChange([
                                                                        ...field.value,
                                                                        item.value,
                                                                    ]);
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter(
                                                                            (val) => val !== item.value
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>
                                )}
                            />
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            mt={5}
                            gap={1}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => reset(defaultValues)}
                            >
                                Cancel
                            </Button>

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting || loadingOutlet}
                            >
                                Update
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider>
    );
}