import { useState } from 'react';
import { paramCase } from 'change-case';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Grid,
  Card,
  Button,
  Avatar,
  Typography,
  Tabs,
  Divider,
  TableContainer,
  TableBody,
  TablePagination,
  FormControlLabel,
  Table,
  Tooltip,
  IconButton,
  Switch,
  Tab,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../components/table';
// hooks
import useTable, { emptyRows, getComparator } from '../../../../hooks/useTable';
import useTabs from '../../../../hooks/useTabs';
// mocks
import { _tripList } from '../../../../_mock';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import BookingTableRow from './BookingTableRow';
import BookingTableToolbar from './BookingTableToolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  // 'ux designer',
  // 'full stack designer',
  // 'backend developer',
  // 'project manager',
  // 'leader',
  // 'ui designer',
  // 'ui/ux designer',
  // 'front end developer',
  // 'full stack developer',
];

const TABLE_HEAD = [
  { id: 'tripName', label: 'Trip Name', align: 'left' },
  { id: 'tripDate', label: 'Trip Date', align: 'left' },
  { id: 'buyDate', label: 'Buy Date', align: 'left' },
  { id: 'tripPrice', label: 'Price', align: 'left' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'center' },
  { id: '' },
];

ProfileFollowers.propTypes = {
  followers: PropTypes.array,
};

export default function ProfileFollowers({ followers }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(_tripList);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  console.log(tableData);
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Bookings
      </Typography>

      {/* <Grid container spacing={3}>
        {followers.map((follower) => (
          <Grid key={follower.id} item xs={12} md={4}>
            <FollowerCard follower={follower} />
          </Grid>
        ))}
      </Grid> */}

      <Card>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={filterStatus}
          onChange={onChangeFilterStatus}
          sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab disableRipple key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        <Divider />

        <BookingTableToolbar
          filterName={filterName}
          filterRole={filterRole}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          optionsRole={ROLE_OPTIONS}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            {selected.length > 0 && (
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <BookingTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.name)}
                  />
                ))}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />

          <FormControlLabel
            control={<Switch checked={dense} onChange={onChangeDense} />}
            label="Dense"
            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
          />
        </Box>
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.role === filterRole);
  }

  return tableData;
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
  follower: PropTypes.object,
};

function FollowerCard({ follower }) {
  const { name, country, avatarUrl, isFollowed } = follower;

  const [toggle, setToogle] = useState(isFollowed);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon={'eva:pin-fill'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {country}
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        onClick={() => setToogle(!toggle)}
        variant={toggle ? 'text' : 'outlined'}
        color={toggle ? 'primary' : 'inherit'}
        startIcon={toggle && <Iconify icon={'eva:checkmark-fill'} />}
      >
        {toggle ? 'Followed' : 'Follow'}
      </Button>
    </Card>
  );
}
