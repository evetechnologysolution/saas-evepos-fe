import PropTypes from 'prop-types';
// @mui
import { styled, Stack, TableRow, TableCell, Typography, Button, ButtonBase } from '@mui/material';
// components
import { useSnackbar } from 'notistack';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
// utils
import { formatDate2 } from '../../../../utils/getData';
// default picture
import defaultMenu from '../../../../assets/default_menu.jpg';
import defaultBeverage from '../../../../assets/default_beverage.jpg';

// ----------------------------------------------------------------------
GalleryTableRow.propTypes = {
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

export default function GalleryTableRow({ row, onEditRow, onDeleteRow }) {
  const { date, name, image, section } = row;
  const { enqueueSnackbar } = useSnackbar();

  const showImage = () => {
    if (!image && section === 'Kitchen') {
      return defaultMenu;
    }
    if (!image && section === 'Bar') {
      return defaultBeverage;
    }
    return image;
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Image disabledEffect alt={name} src={showImage()} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} /> */}
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Image disabledEffect alt={name} src={showImage()} sx={{ borderRadius: 1.5, width: 128, height: 128, mr: 2 }} />
      </TableCell>
      <TableCell>
        <ButtonBase
          type="button"
          onClick={() => {
            try {
              navigator.clipboard.writeText(`![${name}](${image})`);
              enqueueSnackbar('Sukses menyalin url !');
            } catch (error) {
              enqueueSnackbar('Terjadi kesalahan saat menyalin url !', { variant: 'error' });
            }
          }}
        >
          <Typography variant="subtitle2" color="primary" noWrap>
            Copy to Clipboard
          </Typography>
        </ButtonBase>
      </TableCell>

      {/* <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={isAvailable ? 'success' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {isAvailable ? 'Available' : 'Not Available'}
        </Label>
      </TableCell> */}

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
