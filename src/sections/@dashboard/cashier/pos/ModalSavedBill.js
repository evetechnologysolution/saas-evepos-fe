import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Table,
    TableBody,
    TableContainer,
    TablePagination
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useTable, { emptyRows } from '../../../../hooks/useTable';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../components/table';
// context
import { cashierContext } from "../../../../contexts/CashierContext";
// sections
import { OrdersTableRow } from '../orders';

// ----------------------------------------------------------------------

ModalSavedBill.propTypes = {
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

const TABLE_LOCAL_HEAD = [
    { id: 'date', label: 'Date', align: 'center' },
    { id: '', label: 'Customer Name', align: 'center' },
    { id: 'deliveryPrice', label: 'Delivery Fee', align: 'center' },
    { id: 'billedAmount', label: 'Total', align: 'center' },
    { id: 'payment', label: 'Payment', align: 'center' },
    // { id: 'action', label: 'Action', align: 'center' },
];

export default function ModalSavedBill(props) {

    const ctx = useContext(cashierContext);

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'date',
        defaultOrder: 'desc',
        defaultRowsPerPage: 10,
    });

    // local data
    const [tableDataLocal, setTableDataLocal] = useState(ctx.savedOrders);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTableDataLocal(ctx.savedOrders);
    }, [ctx.savedOrders]);

    const dataFilteredLocal = tableDataLocal;

    const isNotFoundLocal = (!dataFilteredLocal.length);

    const handleSync = async () => {
        setIsLoading(true);
        await ctx.savedOrders.map((item) => {
            const objData = {
                _id: item._id,
                staff: item.staff,
                customer: item.customer,
                orders: item.orders,
                orderType: item.orderType,
                status: item.status,
                havePaid: item.havePaid ? item.havePaid : 0,
                discount: item.discount,
                discountPrice: item.discountPrice,
                billedAmount: item.billedAmount,
                payment: item.payment,
                cardNumber: item.cardNumber,
                notes: item.notes,
            };

            return ctx.createOrders(objData, true); // sync
        });

        setTableDataLocal(ctx.savedOrders);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (ctx.savedOrders.length > 0) {
            const interval = setInterval(() => {
                handleSync();
                // console.log('auto sync');
            }, 300000); // 5 minutes
            return () => {
                clearInterval(interval);
            }
        }
    }, [ctx.savedOrders]);

    const handleClose = () => {
        props.onClose();
    };

    return (

        <>

            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="md"
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ borderBottom: "1px solid #ccc" }}>
                    Local Activity
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    <Scrollbar>
                        <TableContainer sx={{ position: 'relative' }}>

                            <Table size="medium">
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_LOCAL_HEAD}
                                    rowCount={tableDataLocal.length}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {dataFilteredLocal.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                        <OrdersTableRow
                                            key={i}
                                            row={row}
                                            local
                                            closeLocal={handleClose}
                                        />
                                    ))}

                                    <TableEmptyRows height={52} emptyRows={emptyRows(page, rowsPerPage, tableDataLocal.length)} />

                                    <TableNoData isNotFound={isNotFoundLocal} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 40]}
                            component="div"
                            count={dataFilteredLocal.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <LoadingButton
                        variant="contained"
                        loading={isLoading}
                        disabled={ctx.savedOrders.length > 0 ? Boolean(false) : Boolean(true)}
                        onClick={() => handleSync()}
                    >
                        Sync
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog >
        </>
    );
}
