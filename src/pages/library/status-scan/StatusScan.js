import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
// routes
import ConfirmDialog from 'src/components/ConfirmDialog';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../../components/table';
import ConfirmDelete from '../../../components/ConfirmDelete';
// sections
import StatusTableRow from './row';
// utils
import useStatus from './service/useService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'name', label: 'Status Name', align: 'left' },
  // { id: 'name', label: 'Previous Status Name', align: 'left' },
  { id: 'basePoint', label: 'Progress Point', align: 'center' },
  { id: 'archived', label: 'Archived', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function LibraryCategory() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { dense, onChangeDense } = useTable();
  const { list, remove, update } = useStatus();

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
  });

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [currentArchive, setCurrentArchive] = useState(null);

  const [search, setSearch] = useState('');

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
      setController({
        page: 0,
        rowsPerPage: controller.rowsPerPage,
        search,
      });
    }
  };

  const handleEditRow = (id) => {
    navigate(`/dashboard/library/status-scan/${id}/edit`);
  };

  const handleArchiveRow = (id, current) => {
    const prev = Boolean(current);
    setSelectedId(id);
    setCurrentArchive(!prev);
    setOpenArchive(!openArchive);
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    remove.mutate(selectedId, {
      onSuccess: () => {
        enqueueSnackbar('Status deleted!', { variant: 'success' });
        setOpen(false);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || 'Failed to delete', { variant: 'error' });
      },
    });
  };

  const handleArchive = async () => {
    if (!selectedId) return;

    await handleMutationFeedback(update.mutateAsync({ id: selectedId, payload: { archived: currentArchive } }), {
      successMsg: 'Status berhasil disimpan!',
      errorMsg: 'Gagal menyimpan status!',
      onSuccess: () => setOpenArchive(false),
      enqueueSnackbar,
    });
    setCurrentArchive(null);
  };

  return (
    <>
      <Page title="Status Scan">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card>
            <Typography variant="h6" mx={1}>
              Status Scan
            </Typography>

            <Stack
              flexDirection={{ sm: 'row' }}
              flexWrap="wrap"
              alignItems={{ sm: 'center' }}
              justifyContent={{ sm: 'space-between' }}
              mr={1}
              mb={{ xs: 2 }}
            >
              <div style={{ minWidth: '40%' }}>
                {/* <CategoryTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} /> */}
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={'/dashboard/library/status-scan/new'}
              >
                New Status
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
                          <StatusTableRow
                            key={row._id}
                            row={row}
                            onEditRow={() => handleEditRow(row._id)}
                            onArchiveRow={() => handleArchiveRow(row._id, row.archived)}
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

      <ConfirmDialog
        title="Archive"
        text="Are you sure want to archive this status ?"
        open={openArchive}
        onClose={handleArchiveRow}
        onClick={handleArchive}
      />
      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={remove.isLoading} />
    </>
  );
}
