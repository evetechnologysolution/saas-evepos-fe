import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";
// @mui
import {
    Box,
    Button,
    Card,
    Table,
    Switch,
    TableBody,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Stack,
    Typography,
} from "@mui/material";
import axios from "../../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useTable from "../../../hooks/useTable";
// components
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";
// sections
import { ActivityTableToolbar, ActivityTableRow } from "./table";
// context

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "date", label: "Date", align: "center" },
    { id: "staff", label: "Staff", align: "left" },
    { id: "order", label: "Order ID", align: "left" },
    { id: "qtyKg", label: "Qty (kg)", align: "center" },
    { id: "qtyPcs", label: "Qty (pcs)", align: "center" },
    { id: "status", label: "Activity", align: "center" },
];

// ----------------------------------------------------------------------

export default function ListActivity() {
    const {
        dense,
        onChangeDense,
    } = useTable();

    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState("");

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10,
        search: "",
        periodBy: "all"
    });

    const getData = async ({ queryKey }) => {
        const [, params] = queryKey; // Extract query params
        const queryString = new URLSearchParams(params).toString(); // Build query string
        try {
            const res = await axios.get(`/progress/log?${queryString}`);
            setCountData(res?.data?.totalDocs || 0);
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        }
    };

    const { isLoading, data: tableData } = useQuery(
        [
            "listActivity",
            {
                page: controller.page + 1,
                perPage: controller.rowsPerPage,
                search: controller.search || "",
                periodBy: controller.periodBy || ""
            },
        ],
        getData
    );

    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    const handlePeriod = (event) => {
        setController({
            ...controller,
            periodBy: event.target.value
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            setController({
                ...controller,
                page: 0,
                rowsPerPage: controller.rowsPerPage,
                search: search !== "" ? search : "",
            });
        }
    };

    return (
        <>
            <Card>
                <Typography variant="h6" mx={1}>
                    List Activity
                </Typography>

                <Stack
                    flexDirection={{ sm: "row" }}
                    flexWrap="wrap"
                    alignItems={{ sm: "center" }}
                    justifyContent={{ sm: "space-between" }}
                    mr={1}
                    mb={{ xs: 2, sm: 0 }}
                >
                    <div style={{ minWidth: "40%" }}>
                        <ActivityTableToolbar
                            filterName={search}
                            onFilterName={handleSearch}
                            filterPeriod={controller.periodBy}
                            onFilterPeriod={handlePeriod}
                            onEnter={handleOnKeyPress}
                        />
                    </div>
                    {/* <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                component={RouterLink}
                                to={PATH_DASHBOARD.user.create}
                            >
                                New User
                            </Button> */}
                </Stack>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 980, position: "relative" }}>

                        <Table size={dense ? "small" : "medium"}>
                            <TableHeadCustom
                                headLabel={TABLE_HEAD}
                                rowCount={tableData?.docs?.length || 0}
                            />

                            <TableBody>
                                {!isLoading ? (
                                    <>
                                        {tableData?.docs?.map((row, i) => (
                                            <ActivityTableRow
                                                key={i}
                                                row={row}
                                            />
                                        ))}

                                        <TableNoData isNotFound={tableData?.docs?.length === 0} />
                                    </>
                                ) : (
                                    <TableLoading />
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <Box sx={{ position: "relative" }}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={countData}
                        rowsPerPage={controller.rowsPerPage}
                        page={controller.page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <FormControlLabel
                        control={<Switch checked={dense} onChange={onChangeDense} />}
                        label="Dense"
                        sx={{ px: 3, py: 1.5, top: 0, position: { md: "absolute" } }}
                    />
                </Box>
            </Card>
        </>
    );
}
