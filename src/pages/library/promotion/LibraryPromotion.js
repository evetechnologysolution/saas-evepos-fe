import React, { useState, useContext } from 'react';
import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
// @mui
import {
  Container,
  Button,
  Card,
  TableContainer,
  Table,
  TableBody,
  Box,
  TablePagination,
  FormControlLabel,
  Switch,
  Stack,
  Typography,
} from '@mui/material';

import axios from '../../../utils/axios';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// hooks
import useSettings from '../../../hooks/useSettings';
import useTable from '../../../hooks/useTable';

// components
import Scrollbar from '../../../components/Scrollbar';
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import { TableHeadCustom, TableLoading, TableNoData } from '../../../components/table';
import ConfirmDelete from '../../../components/ConfirmDelete';

// context
import { mainContext } from '../../../contexts/MainContext';

// section
import { PromotionTableToolbar, PromotionTableRow } from '../../../sections/@dashboard/library/promotion';
import usePromotion from './service/usePromotion';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'promotionName', label: 'Promotion Name', align: 'left' },
  { id: 'products', label: 'Products', align: 'left' },
  { id: 'promotionType', label: 'Promotion Type', align: 'left' },
  { id: 'validUntil', label: 'Valid Until', align: 'center' },
  { id: 'isAvailable', label: 'Status', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function PromotionList() {
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { list, remove } = usePromotion();

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search || '',
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
    navigate(PATH_DASHBOARD.library.promotionEdit(paramCase(id)));
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    remove.mutate(selectedId, {
      onSuccess: () => {
        enqueueSnackbar('Promotion deleted!', { variant: 'success' });
        setOpen(false);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || 'Failed to delete', { variant: 'error' });
      },
    });
  };

  return (
    <>
      <Page title="Promotion">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card>
            <Typography variant="h6" mx={1}>
              Promotion
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
                <PromotionTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.library.promotionCreate}
              >
                New Promotion
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
                          <PromotionTableRow
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
      </Page>

      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={remove.isLoading} />
    </>
  );
}
