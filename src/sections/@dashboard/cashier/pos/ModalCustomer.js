import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
} from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../components/table';
// sections
import { CustomerTableToolbar, CustomerTableRow } from '../customer';
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalCustomer.propTypes = {
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

const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'phone', label: 'Phone', align: 'center' },
];

export default function ModalCustomer(props) {

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
        defaultOrderBy: 'name',
        defaultOrder: 'asc',
        defaultRowsPerPage: 10,
    });

    const [tableData, setTableData] = useState(ctx.customer);

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        setTableData(ctx.customer);
    }, [ctx.customer]);


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


    const handleClose = () => {
        props.onClose();
    };

    const handleSelected = (value) => {
        const getCustomer = ctx.customer.filter((item) => (
            item._id === value
        ));
        ctx.setCustomerName(getCustomer[0].name);
        ctx.setCustomerPhone(getCustomer[0].phone);
        setFilterName("");
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
                    Saved Customer
                </BootstrapDialogTitle>
                <DialogContent dividers>

                    <CustomerTableToolbar
                        filterName={filterName}
                        onFilterName={handleFilterName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ position: 'relative' }}>

                            <Table size="medium">
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    onSort={onSort}
                                />

                                <TableBody>
                                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <CustomerTableRow
                                            key={row._id}
                                            row={row}
                                            cashier
                                            onClickRow={() => handleSelected(row._id)}
                                        />
                                    ))}

                                    <TableEmptyRows height={52} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 40]}
                            component="div"
                            count={dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Box>

                </DialogContent>

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
            (item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 || item.phone.indexOf(filterName) !== -1)
        ));
    }

    return tableData;
}
