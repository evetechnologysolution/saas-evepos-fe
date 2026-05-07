import { useState, useRef, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { CSVLink } from 'react-csv';
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
import { LoadingButton } from '@mui/lab';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
import ConfirmDelete from '../../components/ConfirmDelete';
// utils
import axios from '../../utils/axios';
import { formatDate, formatDate2, formatQDate } from '../../utils/getData';
// sections
import { OrdersTableToolbar, OrdersTableRow } from '../../sections/@dashboard/cashier/orders';
import { mainContext } from '../../contexts/MainContext';
import useOrder from './service/useOrder';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Paid', 'Unpaid'];

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center', width: 130 },
  { id: '', label: 'Order ID', align: 'left', width: 80 },
  { id: '', label: 'Customer', align: 'left', width: 80 },
  { id: '', label: 'Orders', align: 'left', width: 200 },
  { id: 'status', label: 'Status', align: 'center', width: 80 },
  { id: 'deliveryPrice', label: 'Delivery Fee', align: 'center', width: 100 },
  { id: 'billedAmount', label: 'Total', align: 'center', width: 100 },
  // { id: 'havePaid', label: 'Received', align: 'center', width: 100 },
  { id: '', label: 'Payment', align: 'center', width: 100 },
  { id: '', label: 'Print', align: 'center', width: 100 },
  { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierOrders() {
  const ctm = useContext(mainContext);
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { list, remove } = useOrder();

  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);

  const headers = [
    'Order Date',
    'Payment Date',
    'Order ID',
    'Order Type',
    'Status',
    'Item',
    'Price',
    'Qty',
    'Discount',
    'Delivery Fee',
    'Discount Delivery Fee',
    'Total',
    'Payment',
  ];
  const exportCsv = useRef(null);
  const [exportData, setExportData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);

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
  });

  const showOrderType = (orderType) => {
    if (orderType?.toLowerCase() === 'onsite') {
      return 'Onsite';
    }
    return 'Delivery';
  };

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

  const handleExport = async () => {
    setLoadingExport(true);

    handleSearch();

    let url = `/order/export`;
    const params = new URLSearchParams();

    if (ctm?.selectedOutlet) {
      params.append("outletRef", ctm?.selectedOutlet);
    }

    if (controller.status) {
      params.append("status", controller.status);
    }

    if (controller.search) {
      params.append("search", controller.search);
    }

    if (controller.start && controller.end) {
      params.append("start", controller.start);
      params.append("end", controller.end);
      params.append("sortBy", "createdAt");
      // params.append("paidStart", controller.start);
      // params.append("paidEnd", controller.end);
      // params.append("sortBy", "paymentDate");
      params.append("sortType", "desc");
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }


    const result = [];
    await axios.get(url).then((response) => {
      response.data.forEach((data) => {
        let payment;
        if (!data.refundType) {
          if (data.payment === 'Card') {
            payment = `${data.payment} | ${data.cardBankName} a/n ${data.cardAccountName} ${data.cardNumber}`;
          } else {
            payment = data.payment;
          }
        } else {
          payment = 'Refund';
        }
        result.push([
          formatDate2(data.createdAt),
          data.paymentDate ? formatDate2(data.paymentDate) : '',
          data.orderId || data._id,
          showOrderType(data.orderType),
          data.status,
          data.orders[0].name,
          data.orders[0].price,
          data.orders[0].qty,
          data.discountPrice ? data.discountPrice : 0,
          data.deliveryPrice ? data.deliveryPrice : 0,
          data.deliveryPriceDisc ? data.deliveryPriceDisc : 0,
          data.billedAmount,
          payment,
        ]);

        if (data.orders.length > 1) {
          data.orders.forEach((row, i) => {
            if (i > 0) {
              result.push([
                '',
                '',
                '',
                '',
                '',
                row.name,
                row.price,
                row.qty,
                '',
                '',
                '',
                '',
                '',
              ]);
            }
          });
        }
      });
    });

    setExportData(result);

    setTimeout(() => {
      if (result.length > 0) {
        exportCsv.current.link.click();
      } else {
        alert('Export failed because data is empty!');
      }
      setLoadingExport(false);
    }, 1000);
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    remove.mutate(selectedId, {
      onSuccess: () => {
        enqueueSnackbar('Order deleted!', { variant: 'success' });
        setOpen(false);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || 'Failed to delete', { variant: 'error' });
      },
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
            <Typography variant="h6">Orders</Typography>

            <Stack flexDirection={{ md: "row" }} alignItems={{ md: "center" }} gap={2} py={2.5}>
              <Box width="100%">
                <OrdersTableToolbar
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
                  {['owner', 'admin'].includes(user?.role?.toLowerCase()) && (
                    <LoadingButton
                      title="Export"
                      variant="contained"
                      color="info"
                      loading={loadingExport}
                      onClick={() => handleExport()}
                    >
                      <Iconify icon={'material-symbols:download-rounded'} sx={{ width: 25, height: 25 }} />
                    </LoadingButton>
                  )}
                </Stack>
                <CSVLink
                  filename={`Export-Orders-${formatDate(new Date())}`}
                  separator=";"
                  data={exportData}
                  headers={headers}
                  ref={exportCsv}
                />
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
                        <OrdersTableRow key={row._id} row={row} onDeleteRow={() => handleDialog(row._id)} />
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

      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={remove.isLoading} />
    </Page>
  );
}
