import { useState } from 'react';
import { useQuery } from 'react-query';
// @mui
import {
  Box,
  Card,
  Table,
  Stack,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
} from '@mui/material';
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
// sections
import { OrdersTableToolbar, OrdersTableRow } from '../../sections/@dashboard/cashier/delivery';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center', width: 130 },
  { id: '', label: 'Order ID', align: 'left', width: 80 },
  { id: '', label: 'Customer', align: 'left', width: 80 },
  { id: '', label: 'Orders', align: 'left', width: 200 },
  { id: 'deliveryPrice', label: 'Delivery Fee', align: 'center', width: 100 },
  { id: 'billedAmount', label: 'Total', align: 'center', width: 100 },
  { id: 'status', label: 'Status', align: 'center', width: 80 },
  // { id: "progressStatus", label: "Progress Status", align: "center", width: 80 },
  { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierDelivery() {
  const { dense, onChangeDense } = useTable();

  const { themeStretch } = useSettings();

  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState('');

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/order/delivery?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      'listDeliveryOrders',
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || '',
        sort: 'bookingDate:desc,date:desc',
      },
    ],
    getData
  );

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

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (search) {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search,
        });
      } else {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search: '',
        });
      }
    }
  };

  return (
    <Page title="Delivery Orders">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <Stack
            flexDirection={{ sm: 'row' }}
            flexWrap="wrap"
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
            mx={1}
          >
            <Typography variant="h6">Delivery Orders</Typography>
            <div style={{ minWidth: '40%' }}>
              <OrdersTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
            </div>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                <TableBody>
                  {!isLoading ? (
                    <>
                      {tableData?.docs?.map((row) => (
                        <OrdersTableRow key={row._id} row={row} />
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
              count={countData}
              rowsPerPage={controller.rowsPerPage}
              page={controller.page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
