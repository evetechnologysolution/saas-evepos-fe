import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Button,
    TextField,
    InputAdornment,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
// components
import ModalPayment from './ModalPayment';
// utils
import { numberWithCommas } from '../../../../utils/getData';
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalSplitTotal.propTypes = {
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

export default function ModalSplitTotal(props) {

    const ctx = useContext(cashierContext);

    const [amount, setAmount] = useState("");
    const [alert, setAlert] = useState(false);

    const [openPayment, setOpenPayment] = useState(false);
    const handleClosePayment = () => setOpenPayment(false);

    const handleCancel = () => {
        props.onClose();
        ctx.setSplitAmount(0);
    }

    const errorMessage = () => {
        if (alert && amount < 1) return "Amount is required";
        if (alert && amount > ctx.totalPrice) return "Over Bill";
        return "";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || amount > ctx.totalPrice) {
            setAlert(true);
        } else {
            ctx.setSplitAmount(amount);
            setOpenPayment(true);
            props.onClose();
        }

    };

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="xs"
                open={props.open}
            >
                <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc" }}>
                    Split Bill - Rp. {numberWithCommas(ctx.totalPrice)}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            autoFocus
                            id="amount"
                            name="amount"
                            label="Amount"
                            autoComplete="off"
                            decimalScale={2}
                            decimalSeparator="."
                            thousandSeparator=","
                            allowNegative={false}
                            error={alert ? Boolean(true) : Boolean(false)}
                            helperText={errorMessage()}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                            }}
                            onValueChange={(values) => {
                                setAlert(false)
                                if (values.value < 1) {
                                    setAlert(true)
                                }
                                if (values.value > ctx.totalPrice) {
                                    setAlert(true)
                                }
                                setAmount(values.value)
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button variant="outlined" onClick={() => handleCancel()}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Split
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>

            <ModalPayment
                open={openPayment}
                onClose={handleClosePayment}
            />
        </>
    );
}
