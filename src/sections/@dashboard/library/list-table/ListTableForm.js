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
import { Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// context
import { mainContext } from "../../../../contexts/MainContext";

// ----------------------------------------------------------------------

ListTableForm.propTypes = {
    isEdit: PropTypes.bool,
    currentData: PropTypes.object,
};

export default function ListTableForm({ isEdit, currentData }) {
    const navigate = useNavigate();

    const ctx = useContext(mainContext);

    const { enqueueSnackbar } = useSnackbar();

    const NewDataSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name is required'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currentData?._id || '',
            name: currentData?.name || '',
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

    const originalData = isEdit ? ctx.listTable.filter((item) => item._id !== currentData._id) : '';

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
            // if (!isEdit) {
            //     const data = {
            //         name: values.name,
            //     };
            //     ctx.createListTable(data);

            // } else {
            //     ctx.updateListTable({ _id: currentData._id }, values);
            //     ctx.setListTable([
            //         ...originalData,
            //         {
            //             ...currentData,
            //             name: values.name,
            //         },
            //     ]
            //     );
            // }
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.library.category);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFTextField name="name" label="Table Name" />
                        </Stack>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!isEdit ? 'New Category' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
