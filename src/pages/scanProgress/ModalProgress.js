import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
// @mui
import {
    Alert,
    Button,
    styled,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

// ----------------------------------------------------------------------

ModalProgress.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    progress: PropTypes.string,
    detail: PropTypes.object,
    refetchData: PropTypes.func,
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

export default function ModalProgress(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [qty, setQty] = useState(0);
    const [unit, setUnit] = useState("");
    const options = ["pcs", "kg"];

    const handleReset = () => {
        props.onClose();
        setTimeout(() => {
            setShowAlert(false);
            setAlertMessage("");
            setIsError(false);
            setQty(0);
            setUnit("");
        }, 500);
    }

    const handleSubmit = async () => {
        if (!qty || !unit) {
            setIsError(true);
            return;
        }

        setIsError(false);
        setLoading(true); // opsional: kalau pakai indikator loading

        const data = {
            log: {
                status: props?.progress,
                qty,
                unit
            }
        };

        try {
            await axiosInstance.post(`/progress/${props?.detail?._id}`, data);
            await props.refetchData();
            setShowAlert(false);
            setAlertMessage("");
            enqueueSnackbar("Update data success!");
            handleReset();
        } catch (error) {
            console.error("Submit failed:", error);
            setShowAlert(true);
            setAlertMessage(error?.message || "Submit failed")
        } finally {
            setLoading(false); // reset loading state
        }
    };

    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth
            maxWidth="sm"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc", textTransform: "capitalize" }} onClose={handleReset}>
                Proses {props?.progress}
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Stack gap={2}>
                    {showAlert && (
                        <Alert severity="error" sx={{ mb: 1 }}>{alertMessage}</Alert>
                    )}
                    <Stack flexDirection="row" gap={2}>
                        <TextField
                            name="qty"
                            label="Qty"
                            fullWidth
                            type="number"
                            // InputProps={{
                            //     inputProps: { min: 1, max: 100 }
                            // }}
                            onChange={(e) => {
                                const value = e.target.value.replace(/^0+/, "");
                                setQty(value === "" ? "" : Number(value));
                            }}
                            error={isError && !qty ? Boolean(true) : Boolean(false)}
                            helperText={isError && !qty ? "Qty is required" : ""}
                        />
                        <TextField
                            name="unit"
                            label="Unit Satuan"
                            select
                            fullWidth
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            error={isError && !unit ? Boolean(true) : Boolean(false)}
                            helperText={isError && !unit ? "Unit is required" : ""}
                        >
                            {options.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: "body2",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack flexDirection="row" justifyContent="center" gap={2}>
                        <Button variant="outlined" onClick={() => handleReset()} sx={{ minWidth: "80px" }}>
                            Cancel
                        </Button>
                        <LoadingButton variant="contained" loading={loading} onClick={() => handleSubmit()} sx={{ minWidth: "80px" }}>
                            Save
                        </LoadingButton>
                    </Stack>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    );
}
