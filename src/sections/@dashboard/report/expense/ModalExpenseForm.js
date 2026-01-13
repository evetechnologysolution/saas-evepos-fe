import React from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
    Button,
    IconButton,
    styled,
    Grid,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Divider,
    TextField,
    InputAdornment
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { NumericFormat } from "react-number-format";
import axios from "../../../../utils/axios";
// components
import Iconify from "../../../../components/Iconify";
import { FormProvider, RHFTextField, RHFSelect } from "../../../../components/hook-form";

// ----------------------------------------------------------------------

ModalExpenseForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    resetPage: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify icon="eva:close-fill" width={24} height={24} />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const codes = [
    { code: 1, name: "Beban Gaji" },
    { code: 2, name: "Beban Sewa Gedung" },
    { code: 3, name: "Beban Listrik dan Telepon" },
    { code: 4, name: "Beban Lain-lain" },
    { code: 5, name: "Pembelian" },
    { code: 6, name: "Potongan Pembelian" },
    { code: 7, name: "Retur Pembelian dan Pengurangan Harga" },
    { code: 8, name: "Pengeluaran Outlet" },
];

export default function ModalExpenseForm(props) {

    const { enqueueSnackbar } = useSnackbar();
    const client = useQueryClient();

    const NewDataSchema = Yup.object().shape({
        date: Yup.date(),
        code: Yup.number().moreThan(0, "Expense is required"),
        description: Yup.string().required("Detail is required"),
        amount: Yup.number().moreThan(0, "Amount is required"),
    });

    const defaultValues = {
        date: new Date(),
        code: 0,
        description: "",
        amount: 0
    };

    const methods = useForm({
        resolver: yupResolver(NewDataSchema),
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

    const onSubmit = async () => {
        try {
            const objData = {
                date: values.date,
                code: values.code,
                description: values.description,
                amount: values.amount
            };
            await axios.post(`/expense/`, objData).then((response) => {
                if (response.status === 200) {
                    enqueueSnackbar("Create data success!");
                } else {
                    enqueueSnackbar("Create data failed!", { variant: "error" });
                }
            });

            client.invalidateQueries("listExpense");

            props.resetPage();
            props.onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        props.onClose();
        reset();
    }

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="sm"
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose} style={{ borderBottom: "1px solid #ccc" }}>
                    Expense Data
                </BootstrapDialogTitle>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid container spacing={3} mb={3}>
                            <Grid item xs={12}>
                                <Stack spacing={3}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker
                                            label="Date"
                                            inputFormat="dd/MM/yyyy"
                                            value={getValues("date")}
                                            onChange={(newValue) => {
                                                setValue("date", newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
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
                                    <RHFSelect
                                        name="code"
                                        label="Expense"
                                        placeholder="Expense"
                                        // InputLabelProps={{ shrink: true }}
                                        SelectProps={{ native: false }}
                                    >
                                        <MenuItem
                                            value={0}
                                            sx={{
                                                mx: 1,
                                                borderRadius: 0.75,
                                                typography: "body2",
                                                fontStyle: "italic",
                                                color: "text.secondary",
                                            }}
                                            disabled
                                        >
                                            Select One
                                        </MenuItem>
                                        <Divider />
                                        {codes.map((item, n) => (
                                            <MenuItem
                                                key={n}
                                                value={item.code}
                                                sx={{
                                                    mx: 1,
                                                    my: 0.5,
                                                    borderRadius: 0.75,
                                                    typography: "body2",
                                                }}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                    <RHFTextField name="description" label="Detail" autoComplete="off" multiline rows={3} />
                                    <NumericFormat
                                        customInput={RHFTextField}
                                        name="amount"
                                        label="Amount"
                                        autoComplete="off"
                                        decimalScale={2}
                                        decimalSeparator="."
                                        thousandSeparator=","
                                        allowNegative={false}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                        }}
                                        value={getValues("amount") === 0 ? "" : getValues("amount")}
                                        onValueChange={(values) => {
                                            setValue("amount", Number(values.value))
                                        }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pt: "5px !important" }}>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Save
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </BootstrapDialog>
        </>
    );
}
