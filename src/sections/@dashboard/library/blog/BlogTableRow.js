import PropTypes from 'prop-types';
// @mui
import { styled, Stack, TableRow, TableCell, Typography, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// utils
import { formatDate2 } from '../../../../utils/getData';
// default picture
import defaultMenu from '../../../../assets/default_menu.jpg';
import defaultBeverage from '../../../../assets/default_beverage.jpg';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

BlogTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const APP_URL = 'https://evewash.com';

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    borderRadius: '8px',
  },
}));

export default function BlogTableRow({ row, onEditRow, onDeleteRow }) {
  const { date, title, image, spoiler, views, slug, section } = row;

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

        <Image
          disabledEffect
          alt={title}
          src={showImage()}
          sx={{ borderRadius: 1.5, width: 128, height: 128, mr: 2 }}
        />
      </TableCell>

      <TableCell>{title}</TableCell>

      <TableCell>
        <Typography
          variant="subtitle2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {spoiler}
        </Typography>
      </TableCell>
      <TableCell>
        <a href={`${APP_URL}/blog/read/${slug}`} style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer">
          <Typography variant="subtitle2" color="primary">
            {slug}
          </Typography>
        </a>
      </TableCell>
      <TableCell align="center">
        <Typography variant="subtitle2">{views}</Typography>
      </TableCell>

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
