import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, Stack, TableRow, TableCell, Typography, Button } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
// utils
import { formatDate2 } from "../../../../utils/getData";
// default picture
import defaultMenu from "../../../../assets/default_menu.jpg";

// ----------------------------------------------------------------------

BannerTableRow.propTypes = {
    row: PropTypes.object,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
    },
}));

export default function BannerTableRow({ row, onEditRow, onDeleteRow }) {
    const theme = useTheme();

    const { date, name, image, listNumber, isAvailable } = row;

    return (
        <CustomTableRow hover >

            <TableCell align="center">{formatDate2(date)}</TableCell>

            <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Image disabledEffect alt={name} src={image !== "" ? image : defaultMenu} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>
                </div>
            </TableCell>

            <TableCell align="center">{listNumber}</TableCell>

            <TableCell align="center">
                <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={isAvailable ? 'success' : 'error'}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {isAvailable ? 'Available' : 'Not Available'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Stack direction="row" justifyContent="center" gap={1}>
                    <Button title="Edit" variant="contained" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
                        onEditRow();
                    }}>
                        <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
                    </Button>
                    <Button title="Delete" variant="contained" color="error" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => {
                        onDeleteRow();
                    }}>
                        <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                    </Button>
                </Stack>
            </TableCell>

        </CustomTableRow>
    );
}
