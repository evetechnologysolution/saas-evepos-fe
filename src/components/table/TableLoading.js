import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, CircularProgress, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

TableLoading.propTypes = {
  label: PropTypes.string,
};

export default function TableLoading({ label }) {
  return (
    <TableRow>
      <TableCell colSpan={12}>
        <Stack flexDirection="column" justifyContent="center" alignItems="center" gap={1} py={17.5}>
          <CircularProgress />
          <Typography variant="body2">{label || "Memuat Data"}</Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
