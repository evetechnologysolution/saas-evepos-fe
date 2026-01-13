import React from 'react';
import PropTypes from 'prop-types';
// @mui
import {
    styled,
    Button,
    TableRow,
    TableCell,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";

// ----------------------------------------------------------------------

ExpenseTableRow.propTypes = {
    row: PropTypes.object,
    onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    '&.MuiTableRow-hover:hover': {
        // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
        borderRadius: '8px'
    },
}));

export default function ExpenseTableRow({ row, onDeleteRow }) {

    const { date, code, description, amount } = row;

    const getExpense = (val) => {
        const expenseMap = {
            1: 'Beban Gaji',
            2: 'Beban Sewa Gedung',
            3: 'Beban Listrik dan Telepon',
            4: 'Beban Lain-lain',
            5: 'Pembelian',
            6: 'Potongan Pembelian',
            7: 'Retur Pembelian dan Pengurangan Harga',
            8: 'Pengeluaran Outlet'
        };

        return expenseMap[val] || 'Unknown';
    };

    return (
        <>
            <CustomTableRow hover>

                <TableCell align="center">{formatDate2(date)}</TableCell>

                <TableCell>{getExpense(code)}</TableCell>

                <TableCell>{description}</TableCell>

                <TableCell align="center">{`Rp. ${numberWithCommas(amount)}`}</TableCell>

                <TableCell align="center">
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ p: 0, minWidth: 35, height: 35 }}
                        onClick={() => onDeleteRow()}
                    >
                        <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                    </Button>
                </TableCell>

            </CustomTableRow>
        </>
    );
}
