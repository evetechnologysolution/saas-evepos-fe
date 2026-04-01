import { useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
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
  Stack,
  Typography,
} from '@mui/material';
import Iconify from '../../components/Iconify';
import { formatQDate } from '../../utils/getData';
// routes
import ModalCashCashier from '../../sections/@dashboard/cash-cashier/ModalCashCashier';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
import ConfirmDelete from '../../components/ConfirmDelete';
// sections
import {
  CashLogTableToolbar,
  CashLogTableRow,
  ModalCloseCashier,
} from '../../sections/@dashboard/cash-cashier';
// context
import { mainContext } from '../../contexts/MainContext';
// service
import useCashLog from './service/useCashLog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'createdAt', label: 'Created At', align: 'center', width: 80 },
  { id: '', label: 'Transaction Name', align: 'left', width: 80 },
  { id: 'amount', label: 'Total', align: 'center', width: 80 },
  { id: '', label: 'Type', align: 'center', width: 200 },
  // { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashLog() {
  const { dense, onChangeDense } = useTable();

  const { themeStretch } = useSettings();

  const ctx = useContext(mainContext);

  const { enqueueSnackbar } = useSnackbar();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openCashier, setOpenCashier] = useState(false);

  const { list, remove } = useCashLog();

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    start: controller.start || '',
    end: controller.end || '',
    balanceRef: ctx.existCash?._id
  });

  const handleCLoseModal = () => {
    setOpenCashier(false);
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

  const handleStartDate = (value) => {
    setStartDate(value);
  };

  const handleEndDate = (value) => {
    setEndDate(value);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
    });
  };

  const handleSearch = () => {
    let params = {
      page: 0,
      rowsPerPage: controller.rowsPerPage,
    };

    if (startDate && endDate) {
      params = {
        ...params,
        start: formatQDate(startDate),
        end: formatQDate(endDate),
      };
    }

    setController(params);
  };

  const [openCloseCashier, setOpenCloseCashier] = useState(false);

  const handleCloseCashier = async () => {
    setOpenCloseCashier(!openCloseCashier);
    // get data by current page
    setController({
      ...controller,
      page: controller.page,
    });
  };

  const [selectedId, setSelectedId] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDialogDelete = (id) => {
    setSelectedId(id);
    setOpenDelete(!openDelete);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    if (selectedId) {
      await remove.mutateAsync(selectedId);
      enqueueSnackbar('Delete success!');
    }
    handleDialogDelete();
    setLoadingDelete(false);
    // get data by current page
    setController({
      ...controller,
      page: controller.page,
    });
  };

  return (
    <Page title="Cashier History">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <Typography variant="h6" mx={1}>
            Cash Cashier Log
          </Typography>

          <Stack
            flexDirection={{ sm: 'row' }}
            flexWrap="wrap"
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
            mr={1}
            mb={{ xs: 2, sm: 0 }}
          >
            <div style={{ minWidth: '40%' }}>
              <CashLogTableToolbar
                filterStartDate={startDate}
                onFilterStartDate={handleStartDate}
                filterEndDate={endDate}
                onFilterEndDate={handleEndDate}
                handleReset={handleReset}
                handleSubmit={handleSearch}
              />
            </div>
            <Stack flexDirection="row" gap={1}>
              {ctx.existCash?.isOpen ? (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() => setOpenCashier(true)}
                >
                  Add Transaction
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:browser-outline" />}
                  onClick={() => setOpenCashier(true)}
                >
                  Open Cashier
                </Button>
              )}
              {ctx.existCash?.isOpen && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Iconify icon="eva:close-fill" />}
                  onClick={() => setOpenCloseCashier(true)}
                >
                  Close Cashier
                </Button>
              )}
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
                        <CashLogTableRow key={row._id} row={row} onDeleteRow={() => handleDialogDelete(row._id)} />
                      ))}

                      <TableNoData isNotFound={!tableData?.docs?.length} />
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
              count={tableData?.docs?.length || 0}
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

      <ModalCashCashier open={openCashier} onClose={handleCLoseModal} />

      <ModalCloseCashier
        open={openCloseCashier}
        handleClose={() => setOpenCloseCashier(false)}
        handleCloseCashier={handleCloseCashier}
      />

      <ConfirmDelete open={openDelete} onClose={handleDialogDelete} onDelete={handleDelete} isLoading={loadingDelete} />
    </Page>
  );
}
