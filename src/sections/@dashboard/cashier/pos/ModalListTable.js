import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// context
import { cashierContext } from "../../../../contexts/CashierContext";
import TableView from "../../../../components/tableView/TableView";
import { tableContext } from "../../../../contexts/TableContext";

// ----------------------------------------------------------------------

ModalListTable.propTypes = {
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

// ----------------------------------------------------------------------

export default function ModalListTable(props) {

    const ctx = useContext(cashierContext);
    const ctt = useContext(tableContext);

    useEffect(() => {
        if (props.open) {
            ctt.getTableSetting();
        }
    }, [props.open]);

    const handleClose = () => {
        props.onClose();
    };

    const handleSelected = (roomId, tableId, tableName) => {
        ctx.setSelectedTable({ roomId, tableId, tableName });
        props.onClose();
    };

    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth
            open={props.open}
            className="saved-modal"
            maxWidth="md"
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ borderBottom: "1px solid #ccc" }}>
                List Table
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <TableView onClickEffect={handleSelected} />
            </DialogContent>

        </BootstrapDialog >
    );
}
