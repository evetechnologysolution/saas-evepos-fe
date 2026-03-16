import PropTypes from 'prop-types';
import { styled, TableRow, TableCell } from '@mui/material';
import Label from '../../../../components/Label';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { formatDate2, numberWithCommas } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    borderRadius: '8px',
  },
}));

export default function OrderTableRow({ row }) {
  const { user } = useAuth();

  const { createdAt, paymentDate, orderId, customer, firstOrder, status, billedAmount } = row;

  let statusColor;
  if (status?.toLowerCase() === 'paid') {
    statusColor = 'success';
  } else if (status?.toLowerCase() === 'half paid') {
    statusColor = 'secondary';
  } else if (status?.toLowerCase() === 'unpaid') {
    statusColor = 'warning';
  } else if (status?.toLowerCase() === 'refund') {
    statusColor = 'default';
  } else {
    statusColor = 'error';
  }

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell align="center">{paymentDate ? formatDate2(paymentDate) : '-'}</TableCell>

      <TableCell align="left">{orderId}</TableCell>

      <TableCell align="left">
        <p>{customer?.name || '-'}</p>
        {customer?.phone && (
          <p>
            {!customer?.phone?.includes('EM')
              ? maskedPhone(['owner', 'super admin']?.includes(user?.role), customer?.phone) || '-'
              : '-'}
          </p>
        )}
      </TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={firstOrder ? 'success' : 'warning'} sx={{ textTransform: 'capitalize' }}>
          {firstOrder ? 'Baru' : 'Lama'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={statusColor} sx={{ textTransform: 'capitalize' }}>
          {status}
        </Label>
      </TableCell>

      <TableCell align="center">Rp. {numberWithCommas(billedAmount || 0)}</TableCell>
    </CustomTableRow>
  );
}
