import { useState } from 'react';
// @mui
import {
  Box,
  Button,
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
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
// utils
import { formatQDate } from '../../utils/getData';
// sections
import { TransferTableToolbar, TransferTableRow } from '../../sections/@dashboard/cashier/transfer';
import useTransfer from './service/useTransfer';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Paid', 'Unpaid'];

const TABLE_HEAD = [
  { id: 'ordercreatedAt', label: 'Order Date', align: 'center', width: 130 },
  { id: '', label: 'Order ID', align: 'left', width: 80 },
  { id: '', label: 'Customer', align: 'left', width: 80 },
  { id: '', label: 'Orders', align: 'left', width: 200 },
  // { id: 'status', label: 'Status', align: 'center', width: 80 },
  // { id: 'deliveryPrice', label: 'Delivery Fee', align: 'center', width: 100 },
  // { id: 'billedAmount', label: 'Total', align: 'center', width: 100 },
  { id: '', label: 'Destination Outlet', align: 'left', width: 100 },
  { id: '', label: 'Detail Transfer', align: 'center', width: 100 },
  { id: '', label: 'Status Transfer', align: 'center', width: 80 },
  { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierTransfer() {
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  // const { user } = useAuth();
  const { list } = useTransfer();

  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    status: '',
    search: '',
    start: '',
    end: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    status: controller.status,
    start: controller.start || '',
    end: controller.end || '',
    sort: "transfer.createdAt"
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

  const handleFilterStatus = (val) => {
    const fixStatus = val;
    setFilterStatus(val);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search: controller.search || '',
      status: val !== 'All' ? fixStatus : '',
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleSubmit = () => {
    let params = {
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search: '',
      status: '',
      start: '',
      end: '',
    };

    if (search) {
      params.search = search;
    }

    if (filterStatus) {
      params.status = filterStatus !== 'All' ? filterStatus : '';
    }

    if (startDate && endDate) {
      params = {
        ...params,
        start: formatQDate(startDate),
        end: formatQDate(endDate),
      };
    }

    setController(params);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleReset = () => {
    setSearch('');
    setFilterStatus('All');
    setStartDate(null);
    setEndDate(null);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search: '',
      status: '',
      start: '',
      end: '',
    });
  };

  return (
    <Page title="Orders">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <Stack
            flexDirection={{ sm: 'row' }}
            flexWrap="wrap"
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
            gap={1}
            mx={1}
          >
            <Typography variant="h6">Transfer Orders</Typography>

            <Stack flexDirection={{ md: "row" }} alignItems={{ md: "center" }} gap={2} py={2.5}>
              <Box width="100%">
                <TransferTableToolbar
                  options={STATUS_OPTIONS}
                  filterStatus={filterStatus}
                  handleFilterStatus={handleFilterStatus}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  filterName={search}
                  onFilterName={handleSearch}
                  onEnter={handleOnKeyPress}
                />
              </Box>
              <Box>
                <Stack flexDirection="row" gap={2}>
                  <Button
                    title="Reset"
                    variant="contained"
                    color="warning"
                    sx={{ color: 'white' }}
                    onClick={() => handleReset()}
                  >
                    <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
                  </Button>
                  <Button title="Search" variant="contained" onClick={() => handleSubmit()}>
                    <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                <TableBody>
                  {!isLoading ? (
                    <>
                      {tableData?.docs?.map((row) => (
                        <TransferTableRow key={row._id} row={row} />
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
              count={Number(tableData?.totalDocs || 0)}
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
