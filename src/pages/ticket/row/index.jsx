import PropTypes from 'prop-types';
// @mui
import { styled, Stack, Button, TableRow, TableCell, Chip } from '@mui/material';
// components
// assets
import Iconify from 'src/components/Iconify';
import { formatDate2 } from 'src/utils/getData';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

export default function UserTableRow({ row, onEditRow, onDeleteRow }) {
  const { createdAt, title, status } = row;

  const STATUS_CONFIG = {
    open: { label: 'Open', color: 'success' },
    progress: { label: 'In Progress', color: 'warning' },
    closed: { label: 'Closed', color: 'error' },
  };

  const getBadge = (status) => {
    const config = STATUS_CONFIG[status] ?? { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>
      <TableCell align="left">{title}</TableCell>
      <TableCell align="left">{getBadge(status)}</TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" gap={1}>
          <Button
            title="Edit"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onEditRow();
            }}
          >
            <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
          </Button>
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
