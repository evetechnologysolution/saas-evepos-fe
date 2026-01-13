import { paramCase } from 'change-case';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
    Box,
    Card,
    Table,
    Switch,
    TableBody,
    Container,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Button,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../components/table';
// sections
import { CustomerTableToolbar, CustomerTableRow } from '../../sections/@dashboard/pos/customer';

// context
import { cashierContext } from "../../contexts/CashierContext";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Date', align: 'center' },
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'phone', label: 'Phone', align: 'center' },
    // { id: 'email', label: 'Email', align: 'center' },
    { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function PosCustomer() {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'name',
        defaultOrder: 'asc',
    });

    const ctx = useContext(cashierContext);

    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const [tableData, setTableData] = useState(ctx.customer);

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        setTableData(ctx.customer);
    }, [ctx.customer]);


    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.pos.customerEdit(paramCase(id)));
    };

    const dataFiltered = applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const denseHeight = dense ? 52 : 72;

    const isNotFound =
        (!dataFiltered.length) ||
        (!dataFiltered.length && !!filterName);

    return (
        <Page title="Customer">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Customer"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Pos', href: PATH_DASHBOARD.pos.root },
                        { name: 'Customer' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            component={RouterLink}
                            to={PATH_DASHBOARD.pos.customerCreate}
                        >
                            New Customer
                        </Button>
                    }
                />

                <Card>

                    <CustomerTableToolbar
                        filterName={filterName}
                        onFilterName={handleFilterName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 980, position: 'relative' }}>

                            <Table size={dense ? 'small' : 'medium'}>
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
                                            onEditRow={() => handleEditRow(row._id)}
                                        />
                                    ))}

                                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />

                        <FormControlLabel
                            control={<Switch checked={dense} onChange={onChangeDense} />}
                            label="Dense"
                            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
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
