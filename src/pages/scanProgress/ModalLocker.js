import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { sumBy } from "lodash";
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
    TextField
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";

// ----------------------------------------------------------------------

ModalLocker.propTypes = {
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

export default function ModalLocker(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [qty, setQty] = useState(0);
    const [lockerName, setLockerName] = useState("");

    const handleReset = () => {
        props.onClose();
        setTimeout(() => {
            setLockerName("");
            setShowAlert(false);
            setAlertMessage("");
            setIsError(false);
            setQty(0);
        }, 500);
    }

    const handleSubmit = async () => {
        if (!lockerName) {
            setIsError(true);
            return;
        }

        setIsError(false);
        setLoading(true); // opsional: kalau pakai indikator loading

        const totalQty = sumBy(props?.detail?.orders, (item) => {
            const tot = (item?.qty || 0);
            return tot;
        });

        const data = {
            log: {
                status: props?.progress,
                qty: totalQty,
            },
            lockerName
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
            maxWidth="xs"
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
                    <TextField
                        name="lockerName"
                        label="Locker Name"
                        fullWidth
                        autoComplete="off"
                        InputProps={{
                            inputProps: { maxLength: 15 }
                        }}
                        onChange={(e) => setLockerName(e.target.value.toUpperCase())}
                        value={lockerName}
                        error={isError && !lockerName ? Boolean(true) : Boolean(false)}
                        helperText={isError && !qty ? "Locker Name is required" : ""}
                    />
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
