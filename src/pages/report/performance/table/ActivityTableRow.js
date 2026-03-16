import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, Link, TableRow, TableCell, List, ListItem, ListItemText } from '@mui/material';
import Label from '../../../../components/Label';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { formatDate2 } from '../../../../utils/getData';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

ActivityTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function ActivityTableRow({ row }) {
  const {
    date,
    name,
    unit,
    qty,
    orderRef: { orderId },
    // log,
  } = row;
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell>{row?.staffRef?.fullname || '-'}</TableCell>

      <TableCell align="left">
        {user?.role === 'Super Admin' ? (
          <Link
            component="button"
            variant="subtitle2"
            underline="hover"
            onClick={() => navigate(PATH_DASHBOARD.cashier.ordersEdit(paramCase(row?.order?._id)))}
          >
            {`${orderId}` || '-'}
          </Link>
        ) : (
          `${orderId}` || '-'
        )}
      </TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="center">
        {unit.toLowerCase() === 'kg' ? (
          <List dense>
            <ListItem>
              <ListItemText primary={`${name} - ${qty} ${unit}`} secondary={`by ${row.staffRef.fullname}`} />
            </ListItem>
          </List>
        ) : null}
      </TableCell>

      <TableCell align="center">
        {unit.toLowerCase() === 'pcs' ? (
          <List dense>
            <ListItem>
              <ListItemText primary={`${name} - ${qty} ${unit}`} secondary={`by ${row.staffRef.fullname}`} />
            </ListItem>
          </List>
        ) : null}
      </TableCell>

      <TableCell align="center">
        {unit.toLowerCase() === 'm2' ? (
          <List dense>
            <ListItem>
              <ListItemText primary={`${name} - ${qty} ${unit}`} secondary={`by ${row.staffRef.fullname}`} />
            </ListItem>
          </List>
        ) : null}
      </TableCell>

      <TableCell align="center">
        {unit.toLowerCase() === 'cup' ? (
          <List dense>
            <ListItem>
              <ListItemText primary={`${name} - ${qty} ${unit}`} secondary={`by ${row.staffRef.fullname}`} />
            </ListItem>
          </List>
        ) : null}
      </TableCell>

      {/* <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color="warning"
          sx={{ textTransform: 'capitalize' }}
        >
          {row?.status || '-'}
        </Label>
      </TableCell> */}
    </CustomTableRow>
  );
}
