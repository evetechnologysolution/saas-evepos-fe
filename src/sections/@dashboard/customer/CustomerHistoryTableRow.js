import PropTypes from 'prop-types';
import { styled, TableRow, TableCell } from '@mui/material';
// utils
import { formatDate2 } from '../../../utils/getData';

// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

export default function CustomerTableRow({ row }) {

  const { date, customer, orders } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell align="left">
        <p>{customer?.name || "-"}</p>
        {customer?.phone && (
          <p>{customer?.phone || "-"}</p>
        )}
      </TableCell>

      <TableCell>
        {orders.map((item, i) => (
          <p key={i}>

            {`${item.qty}${item?.category?.toLowerCase() === "kiloan" ? "kg" : ""} x ${item.name}`}
          </p>
        ))}
      </TableCell>

    </CustomTableRow>
  );
}
