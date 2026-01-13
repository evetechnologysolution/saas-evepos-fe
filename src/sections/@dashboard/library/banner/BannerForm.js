import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Card,
    Grid,
    Stack,
    Typography,
    Button
} from '@mui/material';
// axios
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadSingleFile, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

BannerForm.propTypes = {
    isEdit: PropTypes.bool,
    currentData: PropTypes.object,
};

export default function BannerForm({ isEdit, currentData }) {
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const [selectedList, setSelectedList] = useState([]);

    const [loading, setLoading] = useState(false);

    const NewDataSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name is required'),
        image: Yup.string(),
        imageMobile: Yup.string(),
        listNumber: Yup.string().required('List Number is required'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currentData?._id || '',
            name: currentData?.name || '',
            image: currentData?.image || '',
            imageMobile: currentData?.imageMobile || '',
            listNumber: currentData?.listNumber || '',
            isAvailable: currentData?.isAvailable || false,
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
        setValue,
        handleSubmit,
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentData) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }

        const getData = async () => {
            try {
                await axios.get("/banners?page=1&perPage=10").then((response) => {
                    setSelectedList(response.data.docs);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();

    }, [isEdit, currentData]);

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

    const handleDropMobileImg = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setValue(
                    "imageMobile",
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );

    // const handleRemove = () => {
    //     setValue('image', '');
    // };

    const onSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("listNumber", Number(values.listNumber));
            formData.append("image", values.image);
            formData.append("imageMobile", values.imageMobile);
            if (!isEdit) {
                await axios.post("/banners", formData);
            } else {
                formData.append("isAvailable", values.isAvailable);
                await axios.patch(`/banners/${currentData._id}`, formData);
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.library.banner);
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
                        <Stack spacing={3}>
                            {isEdit && (
                                <RHFTextField name="id" label="Banner ID" disabled />
                            )}
                            <RHFTextField name="name" label="Banner Name" autoComplete="off" />
                            <div>
                                <Typography sx={{ mb: 1, ml: 2 }}>List Number</Typography>
                                <Stack
                                    display="grid"
                                    gap={1}
                                    gridTemplateColumns="repeat(auto-fit, 80px)"
                                >
                                    {Array.from({ length: 10 }).map((_, n) => (
                                        <Button
                                            key={n}
                                            variant={values.listNumber === n + 1 ? "contained" : "outlined"}
                                            sx={{ height: 50 }}
                                            onClick={() => setValue('listNumber', n + 1)}
                                            disabled={selectedList?.some(item => item?.listNumber === n + 1) && currentData?.listNumber !== n + 1 ? Boolean(true) : Boolean(false)}
                                        >
                                            {n + 1}
                                        </Button>
                                    ))}
                                </Stack>
                            </div>
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
                                                Disable this if the banner is not available
                                            </Typography>
                                        </>
                                    }
                                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                                />
                            )}
                        </Stack>
                        <Stack spacing={3}>
                            <div>
                                <Typography sx={{ mt: 3, mb: 1 }}>{`Image (max size: 900KB)`}</Typography>
                                <RHFUploadSingleFile
                                    name="image" accept="image/*"
                                    maxSize={900000}
                                    onDrop={handleDrop}
                                />
                            </div>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <div>
                                <Typography sx={{ mb: 1 }}>{`Image (Mobile View) (max size: 900KB)`}</Typography>
                                <RHFUploadSingleFile
                                    name="imageMobile" accept="image/*"
                                    maxSize={900000}
                                    onDrop={handleDropMobileImg}
                                />
                            </div>
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                            <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.banner)}>Cancel</Button>
                            <LoadingButton type="submit" variant="contained" loading={loading}>
                                {!isEdit ? 'New Banner' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider>
    );
}
