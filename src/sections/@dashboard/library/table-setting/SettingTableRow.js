import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, Stack, TableRow, TableCell, Button } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
// utils
import { formatDate2 } from "../../../../utils/getData";

// ----------------------------------------------------------------------

SettingTableRow.propTypes = {
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

export default function SettingTableRow({ row, onEditRow, onDeleteRow }) {
    const theme = useTheme();

    const { date, room, isActive } = row;

    return (
        <CustomTableRow hover >

            <TableCell align="center">{formatDate2(date)}</TableCell>

            <TableCell>{room}</TableCell>

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
