import * as Yup from "yup";
import { useState, useEffect, useContext, useMemo } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import { styled, Container, Typography, Card, Grid, Stack, Button, InputAdornment, FormControlLabel, Switch, Divider } from "@mui/material";
import { NumericFormat } from "react-number-format";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
// context
import { mainContext } from "../../../contexts/MainContext";

// ----------------------------------------------------------------------

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

export default function PerfumeForm() {
    const navigate = useNavigate();

    const ctx = useContext(mainContext);

    const { enqueueSnackbar } = useSnackbar();

    const NewDataSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().default("Parfum"),
    });

    useEffect(() => {
        ctx.getGeneralPerfume();
    }, []);

    const defaultValues = useMemo(
        () => ({
            id: ctx.generalPerfume?._id || "",
            name: ctx.generalPerfume?.name || "Parfum",
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ctx.generalPerfume]
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
    const defaultOption = { name: "", notes: "", price: 0, productionPrice: 0, isMultiple: false, isDefault: false };
    const defaultSuboption = { name: "", notes: "", price: 0, productionPrice: 0, isMultiple: false, isDefault: false };
    const [optionList, setOptionList] = useState([defaultOption]);
    const [subList, setSubList] = useState([defaultSuboption]);

    useEffect(() => {
        if (ctx.generalPerfume) {
            reset(defaultValues);
            setOptionList(ctx.generalPerfume?.options?.length > 0 ? ctx.generalPerfume?.options : [defaultOption]);
            setSubList(ctx.generalPerfume?.suboptions?.length > 0 ? ctx.generalPerfume?.suboptions : [defaultSuboption]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.generalPerfume]);

    const handleOptionNameChange = (e, index, type = "option") => {
        const { value } = e.target;
        const list = type === "suboption" ? [...subList] : [...optionList];
        list[index] = Object.assign(list[index], { name: value });
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleOptionNotesChange = (e, index, type = "option") => {
        const { value } = e.target;
        const list = type === "suboption" ? [...subList] : [...optionList];
        list[index] = Object.assign(list[index], { notes: value });
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleOptionPriceChange = (value, index, type = "option") => {
        const list = type === "suboption" ? [...subList] : [...optionList];
        list[index] = Object.assign(list[index], { price: value });
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleOptionProductionPriceChange = (value, index, type = "option") => {
        const list = type === "suboption" ? [...subList] : [...optionList];
        list[index] = Object.assign(list[index], { productionPrice: value });
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleVariantMultiple = (value, index, type = "option") => {
        const list = type === "suboption" ? [...subList] : [...optionList];
        list[index] = Object.assign(list[index], { isMultiple: value });
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleVariantDefault = (value, index, type = "option") => {
        const list = type === "suboption" ? [...subList] : [...optionList];

        const updated = list.map((item, i) => ({
            ...item,
            isDefault: i === index ? value : false
        }));

        if (type === "suboption") {
            setSubList(updated);
        } else {
            setOptionList(updated);
        }
    };

    const handleOptionAdd = (type = "option") => {
        if (type === "suboption") {
            setSubList([...subList, defaultSuboption]);
        } else {
            setOptionList([...optionList, defaultOption]);
        }
    };

    const handleOptionRemove = (index, type = "option") => {
        const list = type === "suboption" ? [...subList] : [...optionList];
        list.splice(index, 1);
        if (type === "suboption") {
            setSubList(list);
        } else {
            setOptionList(list);
        }
    };

    const handleCancel = () => {
        reset(defaultValues);
        setOptionList(ctx.generalPerfume?.options?.length > 0 ? ctx.generalPerfume?.options : [defaultOption]);
        setSubList(ctx.generalPerfume?.suboptions?.length > 0 ? ctx.generalPerfume?.suboptions : [defaultSuboption]);
    }

    const onSubmit = async () => {
        try {
            const data = {
                name: values.name,
                options: optionList,
                suboptions: subList
            };
            await ctx.saveGeneralPerfume(data);
            reset();
            enqueueSnackbar("Update success!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Page title="Perfume" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Perfume"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        { name: "Perfume" },
                    ]}
                />
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    {/* <RHFTextField name="name" label="Variant Name" autoComplete="off" /> */}

                                    <Typography variant="subtitle1">List of Perfume</Typography>

                                    {optionList?.map((item, index) => (
                                        <Stack key={index} gap={1}>
                                            <Typography variant="subtitle2">No. {index + 1}</Typography>
                                            <RHFTextField
                                                name={`optionName[${index}]`}
                                                placeholder="Perfume Name"
                                                onChange={(e) => handleOptionNameChange(e, index, "option")}
                                                autoComplete="off"
                                                value={item.name}
                                                required
                                                fullWidth
                                            />
                                            <Stack flexDirection={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={3}>
                                                <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ width: "100%" }}>
                                                    <RHFTextField
                                                        name={`optionNotes[${index}]`}
                                                        placeholder="Perfume Notes"
                                                        onChange={(e) => handleOptionNotesChange(e, index, "option")}
                                                        autoComplete="off"
                                                        value={item.notes}
                                                        required
                                                        fullWidth
                                                    />
                                                    {optionList?.length !== 1 && (
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            sx={{
                                                                boxShadow: "0", p: 0, minWidth: 30, height: 30, mb: 0.5, bgcolor: "#FFC2B4", color: "red",
                                                                "&:hover": {
                                                                    bgcolor: "#FFC2B4"
                                                                },
                                                            }}
                                                            size="large"
                                                            onClick={() => handleOptionRemove(index, "option")}
                                                        >
                                                            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    ))}
                                    <Stack alignItems="center">
                                        <Button variant="text" onClick={() => handleOptionAdd("option")}><Iconify icon="eva:plus-fill" width={20} height={20} /> Add Perfume</Button>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Typography variant="subtitle1">List of Options</Typography>

                                    {subList?.map((item, index) => (
                                        <Stack key={index} gap={3}>
                                            <Stack flexDirection={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={3}>
                                                <RHFTextField
                                                    name={`subName[${index}]`}
                                                    placeholder="Option Name"
                                                    onChange={(e) => handleOptionNameChange(e, index, "suboption")}
                                                    autoComplete="off"
                                                    value={item.name}
                                                    required
                                                    fullWidth
                                                />
                                                <NumericFormat
                                                    customInput={RHFTextField}
                                                    name={`subPrice[${index}]`}
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
                                                        handleOptionPriceChange(Number(values.value >= 0 ? values.value : 0), index, "suboption")
                                                    }}
                                                />
                                            </Stack>
                                            <Stack flexDirection={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" gap={3}>
                                                <NumericFormat
                                                    customInput={RHFTextField}
                                                    name={`subProductionPrice[${index}]`}
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
                                                        handleOptionProductionPriceChange(Number(values.value >= 0 ? values.value : 0), index, "suboption")
                                                    }}
                                                />
                                                <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ width: "100%" }}>
                                                    {/* <FormControlLabel
                                                        name={`optionIsMultiple[${index}]`}
                                                        labelPlacement="start"
                                                        sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                                                        control={
                                                            <CustomSwitch
                                                                checked={Boolean(item.isMultiple)}
                                                                onChange={(e) => handleVariantMultiple(e.target.checked, index, "option")}
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
                                                    /> */}
                                                    <FormControlLabel
                                                        name={`subIsDefault[${index}]`}
                                                        labelPlacement="start"
                                                        sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                                                        control={
                                                            <CustomSwitch
                                                                checked={Boolean(item.isDefault)}
                                                                onChange={(e) => handleVariantDefault(e.target.checked, index, "suboption")}
                                                            />
                                                        }
                                                        label={
                                                            <>
                                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                                    Default Option
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                                    Enable for default option
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                    {subList?.length !== 1 && (
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            sx={{
                                                                boxShadow: "0", p: 0, minWidth: 30, height: 30, mb: 0.5, bgcolor: "#FFC2B4", color: "red",
                                                                "&:hover": {
                                                                    bgcolor: "#FFC2B4"
                                                                },
                                                            }}
                                                            size="large"
                                                            onClick={() => handleOptionRemove(index, "suboption")}
                                                        >
                                                            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                            <Divider />
                                        </Stack>
                                    ))}
                                    <Stack alignItems="center">
                                        <Button variant="text" onClick={() => handleOptionAdd("suboption")}><Iconify icon="eva:plus-fill" width={20} height={20} /> Add Option</Button>
                                    </Stack>
                                </Stack>

                                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                                    <Button variant="outlined" onClick={() => handleCancel()}>Cancel</Button>
                                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={optionList?.length > 0 ? Boolean(false) : Boolean(true)}>
                                        Save Changes
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Card>
                </FormProvider>
            </Container>
        </Page>
    );
}
