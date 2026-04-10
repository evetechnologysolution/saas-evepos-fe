import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, Stack, Avatar, Button, TableRow, TableCell, Typography } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { formatDate2 } from '../../../../utils/getData';
// assets
import defaultAvatar from '../../../../assets/avatar_default.jpg';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onPointRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

export default function UserTableRow({ row, onPointRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { user } = useAuth();

  const { _id, createdAt, username, fullname, role, isActive } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullname} src={defaultAvatar} sx={{ mr: 1 }} />
          <Typography variant="subtitle2" noWrap>
            {fullname}
          </Typography>
        </div>
      </TableCell>

      <TableCell align="left">{username}</TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {role}
      </TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={isActive ? 'success' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {isActive ? 'Active' : 'Not Active'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" gap={1}>
          <Button
            title="Custom Point"
            variant="contained"
            color="warning"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onPointRow();
            }}
          >
            <Iconify icon="material-symbols:star-rounded" sx={{ width: 24, height: 24 }} />
          </Button>
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
          {user.role === 'owner' && user._id !== _id && role !== 'owner' && (
            <Button
              title="Delete"
              variant="contained"
              color="error"
              sx={{ p: 0, minWidth: 35, height: 35 }}
              onClick={() => {
                onDeleteRow();
              }}
            >
              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          )}
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
