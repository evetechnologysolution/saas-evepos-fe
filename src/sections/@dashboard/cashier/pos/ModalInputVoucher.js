import React, { useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Button,
    styled,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField
} from '@mui/material';
import Iconify from "../../../../components/Iconify";
import { voucherList } from "../../../../_mock/voucher";
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalInputVoucher.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
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

export default function ModalInputVoucher(props) {
    const ctx = useContext(cashierContext);

    const [isError, setIsError] = useState(false);
    const [voucher, setVoucher] = useState("");

    useEffect(() => {
        if (props.open) {
            setVoucher(ctx.voucherCode);
        }
    }, [props.open]);


    const handleReset = () => {
        props.onClose();
        setTimeout(() => {
            setVoucher("");
            setIsError(false);
        }, 1000);
    }

    const handleCancel = () => {
        handleReset();
    }

    const handleSubmit = () => {
        if (voucher !== '') {
            const foundVoucher = voucherList.find(item => item.code === voucher);
            if (foundVoucher) {
                ctx.setVoucherCode(voucher);
            } else {
                alert("Kode voucher tidak valid!");
            }
            handleReset();
        } else {
            setIsError(true);
        }
    }

    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth
            maxWidth="sm"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc" }} onClose={handleCancel}>
                Input Voucher
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Stack flexDirection="row" gap={2}>
                    <TextField
                        name="customerName"
                        label="Voucher Code"
                        fullWidth
                        autoComplete="off"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                        error={isError ? Boolean(true) : Boolean(false)}
                        helperText={isError ? 'Voucher Code is required' : ''}
                    />
                    <Stack justifyContent="center">
                        <Button variant="contained" onClick={() => handleSubmit()}>
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    );
}
