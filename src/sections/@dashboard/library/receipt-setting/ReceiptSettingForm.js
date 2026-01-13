import * as Yup from "yup";
import { useEffect, useMemo, useContext, useCallback } from "react";
import { useSnackbar } from "notistack";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Card,
    Grid,
    Stack,
    Box,
    Typography,
} from "@mui/material";
// context
import { mainContext } from "../../../../contexts/MainContext";
// components
import { FormProvider, RHFTextField, RHFSelect, RHFUploadAvatar, RHFSwitch } from "../../../../components/hook-form";
// utils
import { numberWithCommas, formatOnlyDate } from "../../../../utils/getData";
import newLineText from "../../../../utils/newLineText";
// _mock
import { province } from "../../../../_mock";
import { headerPrint } from "../../../../_mock/headerPrint";

// ----------------------------------------------------------------------

export default function ReceiptSettingForm() {
    const ctx = useContext(mainContext);

    const { enqueueSnackbar } = useSnackbar();

    const DataSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        phone: Yup.string()
            .matches(/^\d+$/, "Number only!")
            .min(10, "Minimum 10 digit numbers")
            .max(15, "Maximum 15 digit numbers")
            .required("Phone number is required"),
        web: Yup.string(),
        image: Yup.string(),
        address: Yup.string().required("Address is required"),
        province: Yup.string().required("Province is required"),
        city: Yup.string().required("City is required"),
        region: Yup.string().required("Region is required"),
        zipCode: Yup.string(),
        notes: Yup.string(),
        isPrintLogo: Yup.boolean(),
    });

    const defaultValues = useMemo(
        () => ({
            name: ctx.receiptHeader?.name || "",
            phone: ctx.receiptHeader?.phone || "",
            web: ctx.receiptHeader?.web || "",
            image: ctx.receiptHeader?.image || "",
            address: ctx.receiptHeader?.address || "",
            province: ctx.receiptHeader?.province || "",
            city: ctx.receiptHeader?.city || "",
            region: ctx.receiptHeader?.region || "",
            zipCode: ctx.receiptHeader?.zipCode || "",
            notes: ctx.receiptHeader?.notes || "",
            isPrintLogo: ctx.receiptHeader?.isPrintLogo || false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ctx.receiptHeader]
    );

    const methods = useForm({
        resolver: yupResolver(DataSchema),
        defaultValues,
    });

    const {
        setValue,
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (ctx.receiptHeader) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.receiptHeader]);

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

    const onSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("phone", values.phone);
            formData.append("web", values.web);
            formData.append("address", values.address);
            formData.append("province", values.province);
            formData.append("city", values.city);
            formData.append("region", values.region);
            formData.append("zipCode", values.zipCode);
            formData.append("notes", values.notes);
            formData.append("image", values.image);
            formData.append("isPrintLogo", values.isPrintLogo);

            await ctx.updateReceiptHeader(formData);
            enqueueSnackbar("Update success!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <RHFUploadAvatar
                                name="image"
                                accept="image/*"
                                maxSize={900000}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 2,
                                            mx: "auto",
                                            display: "block",
                                            textAlign: "center",
                                            color: "text.secondary",
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png
                                        <br /> max size of 900KB
                                    </Typography>
                                }
                            />
                            <RHFSwitch
                                name="isPrintLogo"
                                labelPlacement="start"
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Print Logo?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            Disable this if you do not want to print the logo
                                        </Typography>
                                    </>
                                }
                                sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
                            />
                            <RHFTextField name="name" label="Name" autoComplete="off" />
                        </Stack>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <RHFTextField name="phone" label="Phone" autoComplete="off" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <RHFTextField name="web" label="Website" autoComplete="off" />
                            </Grid>
                        </Grid>
                        <br />
                        <Stack spacing={3}>
                            <RHFTextField name="address" label="Address" autoComplete="off" multiline rows={3} />
                        </Stack>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <RHFSelect name="province" label="Province">
                                        <option />
                                        {province.map((option, index) => (
                                            <option key={index} value={option.label}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </RHFSelect>
                                    <RHFTextField name="city" label="City" autoComplete="off" />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <RHFTextField name="region" label="Region" autoComplete="off" />
                                    <RHFTextField name="zipCode" label="Zip/Code" />
                                </Stack>
                            </Grid>
                        </Grid>
                        <br />
                        <Stack spacing={3}>
                            <RHFTextField name="notes" label="Notes" autoComplete="off" multiline rows={3} />
                        </Stack>
                        <br />
                        <Stack direction="row" justifyContent="flex-end" gap={1}>
                            <Button variant="outlined" onClick={() => reset(defaultValues)}>Cancel</Button>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Update
                            </LoadingButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box bgcolor="#F1F1F1" height="100%" borderRadius="8px" p={5}>
                            <Stack alignItems="center" justifyContent="center">
                                <Box bgcolor="white" p={5}>
                                    <Typography variant="subtitle2" textTransform="uppercase" align="center">{ctx.receiptHeader?.name || headerPrint.name}</Typography>
                                    {(ctx.receiptHeader?.isPrintLogo && ctx.receiptHeader?.image) && (
                                        <img alt="Logo" src={ctx.receiptHeader?.image} style={{ width: "50px", margin: "1px auto" }} />
                                    )}
                                    <Typography variant="subtitle2" textTransform="capitalize" align="center">
                                        {ctx.receiptHeader?.address || `${headerPrint.address},`}
                                        <br />
                                        {ctx.receiptHeader?.region ? `${ctx.receiptHeader?.region}, ` : `${headerPrint.region}, `}
                                        {ctx.receiptHeader?.city ? `${ctx.receiptHeader?.city}, ` : `${headerPrint.city}, `}
                                        {ctx.receiptHeader?.province ? `${ctx.receiptHeader?.province} ` : `${headerPrint.province} `}
                                        {ctx.receiptHeader?.zipCode || headerPrint.zipCode}
                                    </Typography>
                                    <Typography variant="subtitle2" textTransform="lowercase" align="center">
                                        {ctx.receiptHeader?.phone || headerPrint.phone}
                                    </Typography>
                                    <Typography variant="subtitle2" textTransform="lowercase" align="center">
                                        {ctx.receiptHeader?.web}
                                    </Typography>
                                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                                    <div style={{ textAlign: "left" }}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><Typography variant="body2">Created by</Typography></td>
                                                    <td><Typography variant="body2">: Cashier</Typography></td>
                                                </tr>
                                                <tr>
                                                    <td><Typography variant="body2">Date</Typography></td>
                                                    <td><Typography variant="body2">: {formatOnlyDate(new Date())}</Typography></td>
                                                </tr>
                                                <tr>
                                                    <td><Typography variant="body2">Order ID</Typography></td>
                                                    <td><Typography variant="body2">: ORD0000000132</Typography></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                                    <div>
                                        <Typography variant="body2" align="left">Cheese Burger</Typography>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2">{`1 x ${numberWithCommas(40000)}`}</Typography>
                                            <Typography variant="body2">Rp. {numberWithCommas(40000)}</Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="body2" align="left">Watermelon Juice</Typography>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2">{`1 x ${numberWithCommas(10000)}`}</Typography>
                                            <Typography variant="body2">Rp. {numberWithCommas(10000)}</Typography>
                                        </div>
                                    </div>
                                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2">Total</Typography>
                                        <Typography variant="body2">Rp. {numberWithCommas(50000)}</Typography>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2">Bayar</Typography>
                                        <Typography variant="body2">Rp. {numberWithCommas(50000)}</Typography>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="body2">Kembali</Typography>
                                        <Typography variant="body2">Rp. {numberWithCommas(0)}</Typography>
                                    </div>
                                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                                    {ctx.receiptHeader?.notes && (
                                        <div style={{ width: 300 }}>
                                            <Typography variant="body2" mb={2}>{newLineText(ctx.receiptHeader?.notes)}</Typography>
                                        </div>
                                    )}
                                    <Typography variant="subtitle2" align="center">Powered by EvePOS</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </FormProvider >
    );
}
