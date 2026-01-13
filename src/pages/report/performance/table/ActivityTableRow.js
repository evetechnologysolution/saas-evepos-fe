import PropTypes from "prop-types";
import { paramCase } from "change-case";
import { useNavigate } from "react-router-dom";
// @mui
import { useTheme } from "@mui/material/styles";
import { styled, Link, TableRow, TableCell } from "@mui/material";
import Label from "../../../../components/Label";
// hooks
import useAuth from "../../../../hooks/useAuth";
// utils
import { formatDate2 } from "../../../../utils/getData";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";

// ----------------------------------------------------------------------

ActivityTableRow.propTypes = {
    row: PropTypes.object,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
    "&.MuiTableRow-hover:hover": {
        // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
        borderRadius: "8px"
    },
}));

export default function ActivityTableRow({ row }) {
    const theme = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    return (
        <CustomTableRow hover>
            <TableCell align="center">{formatDate2(row?.date)}</TableCell>

            <TableCell>
                {row?.staff?.fullname || "-"}
            </TableCell>

            <TableCell align="left">
                {user?.role === "Super Admin" ? (
                    <Link
                        component="button"
                        variant="subtitle2"
                        underline="hover"
                        onClick={() => navigate(PATH_DASHBOARD.cashier.ordersEdit(paramCase(row?.order?._id)))}
                    >
                        {row?.order?.orderId || "-"}
                    </Link>
                ) : (
                    row?.order?.orderId || "-"
                )}
            </TableCell>

            <TableCell align="center">{row?.qtyKg ? `${row?.qtyKg} kg` : "-"}</TableCell>

            <TableCell align="center">{row?.qtyPcs ? `${row?.qtyPcs} pcs` : "-"}</TableCell>

            <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                <Label
                    variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                    color="warning"
                    sx={{ textTransform: "capitalize" }}
                >
                    {row?.status || "-"}
                </Label>
            </TableCell>
        </CustomTableRow>
    );
}
