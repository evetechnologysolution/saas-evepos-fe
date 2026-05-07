import PropTypes from 'prop-types';
// @mui
import { styled, Stack, TableRow, TableCell, Button } from '@mui/material';

import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';

import { formatDate2 } from '../../../../utils/getData';

// ----------------------------------------------------------------------

CategoryTableRow.propTypes = {
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

export default function CategoryTableRow({ row, onEditRow, onDeleteRow }) {
  const { createdAt, name, listNumber, outletRef } = row;


  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>
        {Array.isArray(outletRef) && outletRef.length ? (
          <Stack gap={0.5}>
            {outletRef.map((item, i) => (
              <Stack
                key={i}
                flexDirection="row"
                alignItems="center"
                gap={0.5}
              >
                <span>{i + 1}. {item?.name}</span>

                {item?.isPrimary && (
                  <Label
                    variant="ghost"
                    color="success"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    UTAMA
                  </Label>
                )}
              </Stack>
            ))}
          </Stack>
        ) : (
          <span>-</span>
        )}
      </TableCell>

      <TableCell align="center">{listNumber}</TableCell>

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
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
