import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// @mui
import {
    Button,
    IconButton,
    TextField,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalSave.propTypes = {
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

export default function ModalSave(props) {

    const ctx = useContext(cashierContext);

    const { enqueueSnackbar } = useSnackbar();

    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const saveBill = ctx.savedBill;
        const objBill = {
            id: Math.floor(Math.random() * Date.now()),
            date: new Date(Date.now()),
            billName: name,
            roomId: ctx.selectedTable?.roomId || "",
            tableId: ctx.selectedTable?.tableId || "",
            tableName: ctx.selectedTable?.tableName || "",
            orders: ctx.bill,
            orderType: "Manual",
            status: "Pending"
        };
        const asArray = Object.entries(objBill);
        const filtered = asArray.filter(([key, value]) => value !== 0);
        const storeBill = Object.fromEntries(filtered);

        if (ctx.bill.length > 0) {
            ctx.setSavedBill([...saveBill, storeBill]);
        }

        enqueueSnackbar('Save bill success!');

        handleClearBill();
        props.onClose();
    };

    const handleClearBill = () => {
        ctx.setSelectedTable(null);
        ctx.setBill([]);
    }

    return (

        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose} style={{ borderBottom: "1px solid #ccc" }}>
                Save Bill
            </BootstrapDialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        variant="standard"
                        id="billName"
                        name="billName"
                        label="Save As"
                        type="text"
                        autoComplete="off"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="outlined" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </BootstrapDialog>
    );
}
