import PropTypes from 'prop-types';
// @mui
import { styled, Avatar, TableRow, TableCell, Typography, Button } from '@mui/material';

import { formatDate2 } from "../../../../utils/getData";

import defaultAvatar from "../../../../assets/avatar_default.jpg";

// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
    row: PropTypes.object,
    onEditRow: PropTypes.func,
    cashier: PropTypes.bool,
    onClickRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
    },
}));

export default function CustomerTableRow({ row, onEditRow, cashier, onClickRow }) {

    const { date, name, phone } = row;

    return (
        <CustomTableRow hover onClick={!cashier ? null : () => { onClickRow(); }} sx={{ cursor: !cashier ? "default" : "pointer" }} >

            {!cashier && (
                <TableCell align="center">{formatDate2(date)}</TableCell>
            )}

            <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {!cashier && (
                        <Avatar alt={name} src={defaultAvatar} sx={{ mr: 1 }} />
                    )}
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>
                </div>
            </TableCell>

            <TableCell align="center">{phone}</TableCell>

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
