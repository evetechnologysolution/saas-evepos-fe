import PropTypes from 'prop-types';
// @mui
import { styled, TableRow, TableCell } from '@mui/material';
// utils
import { formatDate2, formatTime } from "../../../../utils/getData";

// ----------------------------------------------------------------------

SavedBillTableRow.propTypes = {
    row: PropTypes.object,
    onClickRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
    },
}));

export default function SavedBillTableRow({ row, onClickRow }) {

    const { date, billName, tableName, orderType } = row;

    return (
        <CustomTableRow hover onClick={() => { onClickRow(); }} sx={{ cursor: "pointer" }} >

            <TableCell align="center">{formatDate2(date)}</TableCell>

            <TableCell>{billName}</TableCell>

            <TableCell align="center">{tableName}</TableCell>

            <TableCell align="center">{orderType}</TableCell>

            <TableCell align="center">{formatTime(date)}</TableCell>

        </CustomTableRow>
    );
}
