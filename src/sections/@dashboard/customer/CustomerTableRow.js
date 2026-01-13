import PropTypes from 'prop-types';
import { styled, Stack, TableRow, TableCell, Button, Link } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
// utils
import { formatDate2 } from '../../../utils/getData';

// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  onDetailRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

export default function CustomerTableRow({ row, onDetailRow, onEditRow, onDeleteRow }) {
  const { user } = useAuth();

  const { date, customerId, name, phone, notes } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="center">
        <Link component="button" variant="inherit" underline="hover" onClick={onDetailRow}>
          {customerId}
        </Link>
      </TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{phone}</TableCell>

      <TableCell>{notes}</TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" gap={1}>
          <Button title="Edit" variant="contained" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
            onEditRow();
          }}>
            <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
          </Button>
          {user.role === "Super Admin" && (
            <Button title="Delete" variant="contained" color="error" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
              onDeleteRow();
            }}>
              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          )}
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
