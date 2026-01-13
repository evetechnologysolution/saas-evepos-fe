import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from "react-to-print";
// @mui
import {
    styled,
    Button,
    Link,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Image from '../../../../components/Image';
import Label from '../../../../components/Label';
import QrdataPrint from './QrdataPrint';
// utils
import { formatDate2 } from "../../../../utils/getData";

// ----------------------------------------------------------------------

QrdataTableRow.propTypes = {
    row: PropTypes.object,
    onCloseRow: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
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

export default function QrdataTableRow({ row, onCloseRow }) {

    const { date, qrKey, tableName, pax, image, status } = row;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Print
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    let statusColor;
    if (status?.toLowerCase() === "open") {
        statusColor = "success";
    } else {
        statusColor = "error";
    }

    return (
        <>
            <CustomTableRow hover>

                <TableCell align="center">{formatDate2(date)}</TableCell>

                <TableCell>
                    <Link component="button" variant="inherit" underline="hover" onClick={handleOpen}>
                        {qrKey}
                    </Link>
                </TableCell>

                <TableCell align="center">{tableName}</TableCell>

                <TableCell align="center">{pax}</TableCell>

                <TableCell align="center">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Image disabledEffect alt={qrKey} src={image} sx={{ borderRadius: 1.5, width: 48, height: 48 }} />
                    </div>
                </TableCell>

                <TableCell align="center">
                    <Label
                        variant="ghost"
                        color={statusColor}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {status}
                    </Label>
                </TableCell>

                <TableCell align="center">
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ p: 0, minWidth: 35, height: 35 }}
                        disabled={status?.toLowerCase() === "close" ? Boolean(true) : Boolean(false)}
                        onClick={() => onCloseRow()}
                    >
                        <Iconify icon="fluent:calendar-cancel-24-regular" width={24} height={24} />
                    </Button>
                </TableCell>

            </CustomTableRow>

            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="xs"
                open={open}

            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ borderBottom: "1px solid #ccc" }}>
                    Detail
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Image disabledEffect alt={qrKey} src={image} sx={{ width: 300, height: 300 }} />
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="contained" onClick={handlePrint}>
                        Print
                    </Button>
                </DialogActions>
                <div style={{ overflow: "hidden", height: 0, width: 0 }}>
                    <QrdataPrint ref={printRef} content={row} />
                </div>
            </BootstrapDialog >
        </>
    );
}
