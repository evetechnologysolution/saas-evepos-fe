import { useState } from 'react';
import { useSnackbar } from 'notistack';
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
import { useTheme } from '@mui/material/styles';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
import ConfirmDelete from '../../components/ConfirmDelete';
// sections
import { PickupTableToolbar, PickupTableRow } from '../../sections/@dashboard/cashier/pickup';
import usePickup from './service/usePickup';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Pending', 'Outstanding', 'Picked Up'];

const TABLE_HEAD = [
  { id: 'date', label: 'Order Date', align: 'center', width: 130 },
  { id: '', label: 'Order ID', align: 'left', width: 80 },
  { id: '', label: 'Customer', align: 'left', width: 80 },
  { id: '', label: 'Orders', align: 'left', width: 200 },
  { id: '', label: 'Picked Up By', align: 'left', width: 200 },
  { id: '', label: 'Notes', align: 'center', width: 100 },
  { id: 'status', label: 'Status', align: 'center', width: 80 },
  { id: 'billedAmount', label: 'Total', align: 'center', width: 100 },
  { id: '', label: 'Payment', align: 'center', width: 100 },
  { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function PickupOrders() {
  const { dense, onChangeDense } = useTable();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { list, remove } = usePickup();

  const [filterPickUp, setFilterPickUp] = useState('Pending');
  const [search, setSearch] = useState('');

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    pickup: 'pending',
    search: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    pickup: controller.pickup,
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

  const handleFilterPickUp = (val) => {
    const pickupStatus = val === 'Pending' ? 'pending' : val === 'Outstanding' ? 'outstanding' : 'completed';
    setFilterPickUp(val);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search,
      pickup: pickupStatus,
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      setController({
        page: 0,
        rowsPerPage: controller.rowsPerPage,
        pickup: controller.pickup,
        search,
      });
    }
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
            mx={1}
          >
            <Typography variant="h6">Pickup Orders</Typography>
            <Stack flexDirection={{ sm: 'row' }} alignItems={{ sm: 'center' }} minWidth="50%">
              <Stack
                flexDirection="row"
                gap={1}
                p={0.5}
                mx={1}
                borderRadius="8px"
                border="1px solid #E4E7EA"
                width="fit-content"
                height="fit-content"
              >
                {STATUS_OPTIONS.map((item, i) => (
                  <Button
                    key={i}
                    sx={{
                      boxShadow: 0,
                      color: filterPickUp === item ? theme.palette.primary.main : theme.palette.grey[400],
                      bgcolor: filterPickUp === item ? theme.palette.primary.lighter : '',
                      textTransform: 'capitalize',
                      minWidth: '100px',
                    }}
                    size="large"
                    onClick={() => handleFilterPickUp(item)}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
              <div style={{ width: '100%' }}>
                <PickupTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
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
                        <PickupTableRow key={row._id} row={row} onDeleteRow={() => handleDialog(row._id)} />
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
              count={tableData?.totalPages}
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
