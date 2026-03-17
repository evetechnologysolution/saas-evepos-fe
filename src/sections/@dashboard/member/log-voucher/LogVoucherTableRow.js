import PropTypes from 'prop-types';
import { styled, TableRow, TableCell } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { formatDate2 } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';

// ----------------------------------------------------------------------

LogVoucherTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function LogVoucherTableRow({ row }) {
  const { user } = useAuth();

  const { usedAt, name, voucherCode, voucherType, memberRef } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(usedAt)}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{voucherCode}</TableCell>

      <TableCell>{voucherType === 1 ? 'Diskon' : voucherType === 2 ? 'Hadiah' : 'Pastcard'}</TableCell>

      <TableCell>{memberRef?.memberId}</TableCell>

      <TableCell>{memberRef?.name}</TableCell>

      <TableCell>
        {!memberRef?.phone?.includes('EM')
          ? maskedPhone(['owner', 'super admin']?.includes(user?.role), memberRef?.phone)
          : '-'}
      </TableCell>
    </CustomTableRow>
  );
}
