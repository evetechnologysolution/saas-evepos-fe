import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Button,
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// context
import {cashierContext} from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalNewCustomer.propTypes = {
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

export default function ModalNewCustomer(props) {

    const ctx = useContext(cashierContext);

    const [custName, setCustName] = useState("");
    const [custPhone, setCustPhone] = useState("");


    const handleClose = () => {
        props.onClose();
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: custName,
            phone: custPhone,
        };
        ctx.createCustomer(data);

        const getCustomer = ctx.customer.filter((item) => (
            item.phone === custPhone
        ));

        ctx.setCustomerId(getCustomer[0]._id);
        ctx.setCustomerName(custName);
        setCustName("");
        setCustPhone("");
        props.onClose();
    };

    return (

        <>

            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                open={props.open}
                className="saved-modal"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ borderBottom: "1px solid #ccc" }}>
                    New Customer
                </BootstrapDialogTitle>
                <form
                    onSubmit={handleSubmit}
                >
                    <DialogContent dividers>
                        <TextField
                            autoFocus
                            fullWidth
                            margin="dense"
                            id="name"
                            name="name"
                            type="text"
                            label="Name"
                            autoComplete="off"
                            required
                            onChange={(e) => setCustName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            id="phone"
                            name="phone"
                            type="text"
                            label="Phone"
                            autoComplete="off"
                            required
                            onChange={(e) => setCustPhone(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </form>

            </BootstrapDialog >

        </>
    );
}
