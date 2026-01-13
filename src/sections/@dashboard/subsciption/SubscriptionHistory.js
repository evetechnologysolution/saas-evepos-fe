import React, { useState } from 'react';
// @mui
import {
    styled,
    Box,
    Card,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    TableRow,
    TableCell,
    Typography,
} from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { formatDate2 } from '../../../utils/getData';
// components
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData } from '../../../components/table';

// ----------------------------------------------------------------------

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px',
    },
}));

const TABLE_HEAD = [
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'transactionId', label: 'Transaction ID', align: 'left' },
    { id: 'subscription', label: 'Subscription Type', align: 'center' },
    { id: 'total', label: 'Total', align: 'center' },
    { id: 'payment', label: 'Payment', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
];

const dummyData = [
    {
        _id: '52ffc33cd85242f436000001',
        date: '2023-06-12 16:00',
        transactionId: 'SUB2023000001',
        subscription: 'Basic',
        total: 0,
        paymentMethod: 'Bank Transfer',
        status: 'Success',
    }
]

export default function SubscriptionHistory() {

    // const [tableData, setTableData] = useState(dummyData);
    const tableData = dummyData;

    const isNotFound = !tableData.length;

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 5
    });

    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    return (
        <Card sx={{ margin: '0 5vw', boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)' }}>
            <Box sx={{ p: 5 }} >
                <Typography variant="h6">Subscription History</Typography>
                <br />
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                            <Table size='small'>
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                />

                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <CustomTableRow hover key={index}>
                                            <TableCell>
                                                {formatDate2(row.date)}
                                            </TableCell>
                                            <TableCell>{row.transactionId}</TableCell>
                                            <TableCell align='center'>{row.subscription}</TableCell>
                                            <TableCell align='center'>{`${fCurrency(row.total)}`}</TableCell>
                                            <TableCell align='center'>{row.paymentMethod}</TableCell>
                                            <TableCell align='center'>
                                                <Label variant="ghost" color={row.status.toLocaleLowerCase() === 'success' ? 'success' : 'error'} sx={{ textTransform: 'capitalize' }}>
                                                    {row.status}
                                                </Label>
                                            </TableCell>
                                        </CustomTableRow>
                                    ))}

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={controller.rowsPerPage}
                            page={controller.page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Card>
            </Box>
        </Card>
    );
}
