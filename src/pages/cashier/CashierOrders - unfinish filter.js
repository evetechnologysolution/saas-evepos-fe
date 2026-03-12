import { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableHeadCustom, TableNoData } from '../../../components/table';
// sections
import { OrdersTableToolbar, OrdersTableRow } from '../../../sections/@dashboard/cashier/orders';

// context
import { cashierContext } from '../../../contexts/CashierContext';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center', width: 130 },
  { id: '', label: 'Table', align: 'center', width: 80 },
  { id: '', label: 'Order ID', align: 'left', width: 80 },
  // { id: 'staff', label: 'Staff', align: 'left', width: 80 },
  { id: '', label: 'Orders', align: 'left', width: 200 },
  // { id: 'orderType', label: 'Order Type', align: 'center', width: 100 },
  { id: 'staff', label: 'Order Type', align: 'left', width: 80 },
  { id: 'status', label: 'Status', align: 'center', width: 80 },
  { id: 'billedAmount', label: 'Total', align: 'center', width: 100 },
  { id: 'havePaid', label: 'Received', align: 'center', width: 100 },
  { id: '', label: 'Payment', align: 'center', width: 100 },
  { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierOrders() {
  const {
    dense,
    onChangeDense,
  } = useTable();

  const { themeStretch } = useSettings();

  const ctx = useContext(cashierContext);

  const [tableData, setTableData] = useState([]);
  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState('');

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10
  });

  const isNotFound = !tableData.length;

  useEffect(() => {
    const getData = async () => {
      let url = `/order?page=${controller.page + 1}&perPage=${controller.rowsPerPage}`;
      if (controller.search) {
        url = `${url}&search=${controller.search}`;
      }
      try {
        await axios.get(url).then((response) => {
          setTableData(response.data.docs);
          setCountData(response.data.totalDocs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [controller, ctx.updateOrders]);

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

  const isValidUrl = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  const getLastPath = (thePath) => {
    return thePath.substring(thePath.lastIndexOf('/') + 1);
  }

  let scanValue = "";
  const [printScan, setPrintScan] = useState('');

  useEffect(() => {

    // handle keydown
    const handleKeyDown = (e) => {

      // if key code is 13 (enter) then check if there are scan keys and if there are handle scan 
      if (e.keyCode === 13 && scanValue.length <= 13) {
        handleScanValue(scanValue);
        return;
      }

      // skip if pressed key is shift key
      if (e.keyCode === 16) {
        return;
      }

      // push key code to scan variable
      scanValue += e.key;

      // set timeout to clear variable
      setTimeout(() => {
        scanValue = "";
      }, 100);

    }

    // add event listener to page for keydown
    document.addEventListener('keydown', handleKeyDown);

    // clean up listener
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleScanValue = (value) => {
    setPrintScan(value);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleOnKeyPress = (e) => {
    // if (e.keyCode === 13 && e.target.value.length <= 13) {
    //   setController({
    //     page: 0,
    //     rowsPerPage: controller.rowsPerPage,
    //     search: e.target.value
    //   });
    // }

    if (e.key === 'Enter') {
      if (search) {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search: e.target.value
        });
      } else {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage
        });
      }
    }
  };

  return (
    <Page title="Orders">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Orders"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            // { name: 'Cashier', href: PATH_DASHBOARD.cashier.root },
            { name: 'Orders' },
          ]}
        />

        <Card>
          <OrdersTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                />

                <TableBody>
                  {tableData.map((row) => (
                    <OrdersTableRow key={row._id} row={row} />
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
