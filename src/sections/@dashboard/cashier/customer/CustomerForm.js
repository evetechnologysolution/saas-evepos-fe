import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useContext, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// context
import { cashierContext } from "../../../../contexts/CashierContext";
// utils
import { sortByDate } from "../../../../utils/getData";

// ----------------------------------------------------------------------

CustomerForm.propTypes = {
    isEdit: PropTypes.bool,
    currentData: PropTypes.object,
};

export default function CustomerForm({ isEdit, currentData }) {
    const navigate = useNavigate();

    const ctx = useContext(cashierContext);

    const { enqueueSnackbar } = useSnackbar();

    const NewDataSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name is required'),
        phone: Yup.string().required('Phone number is required'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currentData?._id || '',
            name: currentData?.name || '',
            phone: currentData?.phone || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentData]
    );

    const methods = useForm({
        resolver: yupResolver(NewDataSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const originalData = isEdit ? ctx.customer.filter((item) => item._id !== currentData._id) : '';

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
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (!isEdit) {
                const data = {
                    name: values.name,
                    phone: values.phone,
                };
                ctx.createCustomer(data);

            } else {
                ctx.updateCustomer({ _id: currentData._id }, values);
                ctx.setCustomer(
                    sortByDate([
                        ...originalData,
                        {
                            ...currentData,
                            name: values.name,
                            phone: values.phone,
                        },
                    ])
                );
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.pos.customer);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                columnGap: 2,
                                rowGap: 3,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            {isEdit && (
                                <RHFTextField name="id" label="Customer ID" disabled />
                            )}
                            <RHFTextField name="name" label="Customer Name" />
                            <RHFTextField name="phone" label="Phone" />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!isEdit ? 'New Customer' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
