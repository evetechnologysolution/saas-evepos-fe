import React, { useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Alert,
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalAlert.propTypes = {
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
                        position: 'absolute',
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

export default function ModalAlert(props) {

    const ctx = useContext(cashierContext);

    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth
            maxWidth="xs"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose} style={{ borderBottom: "1px solid #ccc", textAlign: "center", }}>
                Alert
            </BootstrapDialogTitle>
            <DialogContent dividers>
                {ctx.totalPrice === 0 && (
                    <Alert severity="error" sx={{ mb: 2 }}>Bill masih kosong.</Alert>
                )}
            </DialogContent>
        </BootstrapDialog >
    );
}
