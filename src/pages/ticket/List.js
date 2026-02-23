import { paramCase } from 'change-case';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Button,
  Card,
  Table,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
import ConfirmDelete from '../../components/ConfirmDelete';
// sections
import TableRow from './row';
// context
import useTicket from './service/useTicket';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'ticketId', label: 'Ticket ID', align: 'left' },
  { id: 'module', label: 'Module', align: 'left' },
  { id: 'fullname', label: 'Title', align: 'left' },
  { id: 'username', label: 'Status', align: 'left' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { list, remove } = useTicket();

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
    role: '',
    status: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    all: 0,
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

  const handleEditRow = (id) => {
    navigate(`/dashboard/ticket/${id}/edit`);
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    remove.mutate(selectedId, {
      onSuccess: () => {
        enqueueSnackbar('Ticket deleted!', { variant: 'success' });
        setOpen(false);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || 'Failed to delete', { variant: 'error' });
      },
    });
  };

  return (
    <>
      <Page title="Ticket List">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card>
            <Typography variant="h6" mx={1}>
              Ticket
            </Typography>

            <Stack
              flexDirection={{ sm: 'row' }}
              flexWrap="wrap"
              alignItems={{ sm: 'center' }}
              justifyContent={{ sm: 'space-between' }}
              mr={1}
              mb={2}
            >
              <div style={{ minWidth: '40%' }}>
                {/* <UserTableToolbar
                  filterName={search}
                  onFilterName={handleSearch}
                  filterRole={filterRole}
                  onFilterRole={handleFilterRole}
                  optionsRole={ROLE_OPTIONS}
                  onEnter={handleOnKeyPress}
                /> */}
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={'/dashboard/ticket/new'}
              >
                New Ticket
              </Button>
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <TableRow
                            key={row._id}
                            row={row}
                            onEditRow={() => handleEditRow(row._id)}
                            onDeleteRow={() => handleDialog(row._id)}
                          />
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

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={remove.isLoading} />
    </>
  );
}
