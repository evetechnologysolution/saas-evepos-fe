import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    IconButton,
    Button,
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
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../components/table';
// context
import { cashierContext } from "../../../../contexts/CashierContext";
// sections
import SavedBillTableToolbar from './SavedBillTableToolbar';
import SavedBillTableRow from './SavedBillTableRow';
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

const TABLE_SAVED_HEAD = [
    { id: 'date', label: 'Date', align: 'center' },
    { id: 'billName', label: 'Bill Name', align: 'left' },
    { id: 'tableName', label: 'Table Name', align: 'center' },
    { id: 'orderType', label: 'Order Type', align: 'center' },
    { id: '', label: 'Time', align: 'center' },
];

const TABLE_LOCAL_HEAD = [
    { id: 'date', label: 'Date', align: 'center' },
    { id: 'tableName', label: 'Table Name', align: 'center' },
    { id: 'billedAmount', label: 'Total', align: 'center' },
    { id: 'payment', label: 'Payment', align: 'center' },
    { id: 'action', label: 'Action', align: 'center' },
];

export default function ModalSavedBill(props) {

    const ctx = useContext(cashierContext);

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'date',
        defaultOrder: 'desc',
        defaultRowsPerPage: 10,
    });

    const [tableData, setTableData] = useState(ctx.savedBill);

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        setTableData(ctx.savedBill);
    }, [ctx.savedBill]);

    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const isNotFound =
        (!dataFiltered.length) ||
        (!dataFiltered.length && !!filterName);

    // local data
    const [localTab, setLocalTab] = useState(true);
    const [tableDataLocal, setTableDataLocal] = useState(ctx.savedOrders);

    useEffect(() => {
        setTableDataLocal(ctx.savedOrders);
    }, [ctx.savedOrders]);

    const dataFilteredLocal = tableDataLocal;

    const isNotFoundLocal = (!dataFilteredLocal.length);


    const handleSelected = (value) => {
        const getBill = ctx.savedBill.filter((bill) => (
            bill.id === value
        ));
        ctx.setSavedBillID(getBill[0].id);
        ctx.setBill(getBill[0].orders);
        if (getBill[0].tableName) {
            ctx.setSelectedTable({ roomId: getBill[0].roomId, tableId: getBill[0].tableId, tableName: getBill[0].tableName });
        }
        ctx.setOrderType(getBill[0].orderType);
        setFilterName("");
        props.onClose();
    };

    const handleSync = () => {
        ctx.savedOrders.map((item) => {
            const objData = {
                _id: item._id,
                staff: item.staff,
                qrKey: item.qrKey,
                roomId: item.roomId,
                tableId: item.tableId,
                tableName: item.tableName,
                pax: item.pax,
                orders: item.orders,
                orderType: item.orderType,
                status: item.status,
                billedAmount: item.billedAmount,
                payment: item.payment,
                cardNumber: item.cardNumber,
                notes: item.notes,
            };

            return ctx.createOrders(objData, true); // sync
        })

        setTableDataLocal(ctx.savedOrders);
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
        // setLocalTab(false);
        setFilterName("");
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
                    {/* <Button variant="text" color={localTab ? 'inherit' : 'primary'} onClick={() => setLocalTab(false)}>Saved Bill</Button>
                    <Button variant="text" color={localTab ? 'primary' : 'inherit'} onClick={() => setLocalTab(true)}>Local Activity</Button> */}
                    Local Activity
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {!localTab && (
                        <SavedBillTableToolbar
                            filterName={filterName}
                            onFilterName={handleFilterName}
                        />
                    )}

                    <Scrollbar>
                        <TableContainer sx={{ position: 'relative' }}>


                            <Table size="medium">
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={localTab ? TABLE_LOCAL_HEAD : TABLE_SAVED_HEAD}
                                    rowCount={localTab ? tableDataLocal.length : tableData.length}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {localTab ? (
                                        dataFilteredLocal.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                            <OrdersTableRow
                                                key={i}
                                                row={row}
                                                local
                                                closeLocal={handleClose}
                                            />
                                        ))
                                    ) : (

                                        dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <SavedBillTableRow
                                                key={row.id}
                                                row={row}
                                                cashier
                                                onClickRow={() => handleSelected(row.id)}
                                            />
                                        ))

                                    )}

                                    <TableEmptyRows height={52} emptyRows={emptyRows(page, rowsPerPage, localTab ? tableDataLocal.length : tableData.length)} />

                                    <TableNoData isNotFound={localTab ? isNotFoundLocal : isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 40]}
                            component="div"
                            count={localTab ? dataFilteredLocal.length : dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Box>
                </DialogContent>
                {localTab && (
                    <DialogActions sx={{ justifyContent: "center" }}>
                        {ctx.savedOrders.length > 0 ? (
                            <Button variant="contained" onClick={() => handleSync()}>Sync</Button>
                        ) : (
                            <Button variant="contained" disabled>Sync</Button>
                        )}
                    </DialogActions>
                )}
            </BootstrapDialog >
        </>
    );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        tableData = tableData.filter((item) => (
            item.billName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || item.tableName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        ));
    }

    return tableData;
}
