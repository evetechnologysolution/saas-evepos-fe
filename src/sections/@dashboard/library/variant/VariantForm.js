import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled, Typography, Card, Grid, Stack, Button, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import { NumericFormat } from 'react-number-format';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// context
import { mainContext } from "../../../../contexts/MainContext";

// ----------------------------------------------------------------------

VariantForm.propTypes = {
    isEdit: PropTypes.bool,
    currentData: PropTypes.object,
};

const CustomSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-switchBase": {
        "&.Mui-checked": {
            color: "#fff",
            "& + .MuiSwitch-track": {
                opacity: 1,
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 16,
        height: 16,
        margin: 2,
        transition: theme.transitions.create(["width"], {
            duration: 200,
        }),
    },
    "& .MuiSwitch-track": {
        borderRadius: 22 / 2,
        opacity: 1,
        boxSizing: "border-box",
    },
}));

// ----------------------------------------------------------------------

export default function VariantForm({ isEdit, currentData }) {
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

    // list of options
    const [optionList, setOptionList] = useState([{ name: "", price: 0, productionPrice: 0, isMultiple: false }]);

    useEffect(() => {
        if (isEdit && currentData) {
            reset(defaultValues);
            setOptionList(currentData?.options);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentData]);

    const handleOptionNameChange = (e, index) => {
        const { value } = e.target;
        const list = [...optionList];
        list[index] = Object.assign(list[index], { name: value });
        setOptionList(list);
    };

    const handleOptionPriceChange = (value, index) => {
        const list = [...optionList];
        list[index] = Object.assign(list[index], { price: value });
        setOptionList(list);
    };

    const handleOptionProductionPriceChange = (value, index) => {
        const list = [...optionList];
        list[index] = Object.assign(list[index], { productionPrice: value });
        setOptionList(list);
    };

    const handleVariantMultiple = (value, index) => {
        const list = [...optionList];
        list[index] = Object.assign(list[index], { isMultiple: value });
        setOptionList(list);
    };

    const handleOptionAdd = () => {
        setOptionList([...optionList, { name: "", price: 0, productionPrice: 0, isMultiple: false }]);
    };

    const handleOptionRemove = (index) => {
        const list = [...optionList];
        list.splice(index, 1);
        setOptionList(list);
    };

    const onSubmit = async () => {
        try {
            const data = {
                name: values.name,
                options: optionList,
            };
            if (!isEdit) {
                await ctx.createVariant(data);

            } else {
                await ctx.updateVariant(currentData._id, data);
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.library.variant);
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
                            <RHFTextField name="name" label="Variant Name" autoComplete="off" />

                            <Typography variant="subtitle1">List of Options</Typography>

                            {optionList?.map((item, index) => (
                                <Stack key={index} gap={3}>
                                    <Stack flexDirection={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={3}>
                                        <RHFTextField
                                            name={`optionName[${index}]`}
                                            placeholder="Option Name"
                                            onChange={(e) => handleOptionNameChange(e, index)}
                                            autoComplete="off"
                                            value={item.name}
                                            required
                                            fullWidth
                                        />
                                        <NumericFormat
                                            customInput={RHFTextField}
                                            name={`optionPrice[${index}]`}
                                            label="Price"
                                            autoComplete="off"
                                            decimalScale={2}
                                            decimalSeparator="."
                                            thousandSeparator=","
                                            allowNegative={false}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                            }}
                                            value={item.price}
                                            onValueChange={(values) => {
                                                handleOptionPriceChange(Number(values.value >= 0 ? values.value : 0), index)
                                            }}
                                        />
                                    </Stack>
                                    <Stack flexDirection={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={3}>
                                        <NumericFormat
                                            customInput={RHFTextField}
                                            name={`optionProductionPrice[${index}]`}
                                            label="Production Cost"
                                            autoComplete="off"
                                            decimalScale={2}
                                            decimalSeparator="."
                                            thousandSeparator=","
                                            allowNegative={false}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                            }}
                                            value={item.productionPrice}
                                            onValueChange={(values) => {
                                                handleOptionProductionPriceChange(Number(values.value >= 0 ? values.value : 0), index)
                                            }}
                                        />
                                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ width: "100%" }}>
                                            <FormControlLabel
                                                name={`optionIsMultiple[${index}]`}
                                                labelPlacement="start"
                                                sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                                                control={
                                                    <CustomSwitch
                                                        checked={Boolean(item.isMultiple)}
                                                        onChange={(e) => handleVariantMultiple(e.target.checked, index)}
                                                    />
                                                }
                                                label={
                                                    <>
                                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                            Multiple Qty
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                            Enable for multiple
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            {optionList?.length !== 1 && (
                                                <Button
                                                    color="error"
                                                    variant="contained"
                                                    sx={{
                                                        boxShadow: '0', p: 0, minWidth: 30, height: 30, mb: 0.5, bgcolor: "#FFC2B4", color: "red",
                                                        '&:hover': {
                                                            bgcolor: "#FFC2B4"
                                                        },
                                                    }}
                                                    size="large"
                                                    onClick={() => handleOptionRemove(index)}
                                                >
                                                    <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                                                </Button>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ))}

                            {/* {optionList.length < 5 && ( */}
                            <Stack alignItems="center">
                                <Button variant="text" onClick={handleOptionAdd}><Iconify icon="eva:plus-fill" width={20} height={20} /> Add Option</Button>
                            </Stack>
                            {/* )} */}
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                            <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.library.variant)}>Cancel</Button>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={optionList?.length > 0 ? Boolean(false) : Boolean(true)}>
                                {!isEdit ? 'New Variant' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid >
            </Grid >
        </FormProvider >
    );
}
