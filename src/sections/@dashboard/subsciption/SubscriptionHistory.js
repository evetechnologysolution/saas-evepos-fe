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
import { TableHeadCustom, TableNoData, TableLoading } from '../../../components/table';
import useService from './service/useService';

// ----------------------------------------------------------------------

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

const TABLE_HEAD = [
  { id: 'createdAt', label: 'Date', align: 'left' },
  { id: 'invoiceId', label: 'Invoice ID', align: 'left' },
  { id: 'serviceName', label: 'Subscription Plan', align: 'center' },
  { id: 'billedAmount', label: 'Total', align: 'center' },
  { id: 'payment.channel', label: 'Payment', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
];

export default function SubscriptionHistory() {
  const { list } = useService();

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 5,
    search: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    status: 'paid',
  });

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  return (
    <Card
      sx={{
        margin: '0 5vw',
        boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
      }}
    >
      <Box sx={{ p: 5 }}>
        <Typography variant="h6">Subscription History</Typography>
        <br />
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size="small">
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length} />

                <TableBody>
                  {!isLoading ? (
                    <>
                      {tableData?.docs?.map((row, index) => (
                        <CustomTableRow hover key={index}>
                          <TableCell>{formatDate2(row?.createdAt)}</TableCell>
                          <TableCell>{row?.invoiceId}</TableCell>
                          <TableCell align="center">{row?.serviceName}</TableCell>
                          <TableCell align="center">{`${fCurrency(row?.billedAmount || 0)}`}</TableCell>
                          <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                            {row.payment?.channel || 'Cash'}
                          </TableCell>
                          <TableCell align="center">
                            <Label
                              variant="ghost"
                              color={row.status.toLocaleLowerCase() === 'paid' ? 'success' : 'warning'}
                              sx={{ textTransform: 'capitalize' }}
                            >
                              {row.status}
                            </Label>
                          </TableCell>
                        </CustomTableRow>
                      ))}

                      <TableNoData isNotFound={tableData?.docs?.length === 0} />
                    </>
                  ) : (
                    <TableLoading />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={Number(tableData?.totalPages || 0)}
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
