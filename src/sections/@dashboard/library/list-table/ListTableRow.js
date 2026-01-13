import PropTypes from 'prop-types';
// @mui
import { styled, TableRow, TableCell, Button } from '@mui/material';

import { formatDate2 } from "../../../../utils/getData";

// ----------------------------------------------------------------------

ListTableRow.propTypes = {
    row: PropTypes.object,
    cashier: PropTypes.bool,
    onClickRow: PropTypes.func,
    onEditRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
    },
}));

export default function ListTableRow({ row, cashier, onClickRow, onEditRow }) {

    const { date, name } = row;

    return (
        <CustomTableRow hover onClick={!cashier ? null : () => { onClickRow(); }} sx={{ cursor: !cashier ? "default" : "pointer" }} >

            {!cashier && (
                <TableCell align="center">{formatDate2(date)}</TableCell>
            )}

            <TableCell align="center">{name}</TableCell>

            {!cashier && (
                <TableCell align="center">
                    <Button variant="contained" onClick={() => {
                        onEditRow();
                    }}>
                        Update
                    </Button>
                </TableCell>
            )}

        </CustomTableRow>
    );
}
