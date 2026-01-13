import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// @mui
import {
    Box,
    Card,
    Table,
    Button,
    Switch,
    TableBody,
    Container,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Stack,
    Typography,
} from "@mui/material";
import axios from "../../utils/axios";
// hooks
import useSettings from "../../hooks/useSettings";
import useTable from "../../hooks/useTable";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "../../components/table";
import ConfirmDelete from "../../components/ConfirmDelete";
// sections
import { ExpenseTableToolbar, ExpenseTableRow, ModalExpenseForm } from "../../sections/@dashboard/report/expense";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "date", label: "Date", align: "center", width: 130 },
    { id: "", label: "Expense", align: "left", width: 80 },
    { id: "", label: "Detail", align: "left", width: 80 },
    { id: "", label: "Amount", align: "center", width: 80 },
    { id: "", label: "Action", align: "center", width: 10 },
];

const codes = [
    { code: 0, name: "All" },
    { code: 1, name: "Beban Gaji" },
    { code: 2, name: "Beban Sewa Gedung" },
    { code: 3, name: "Beban Listrik dan Telepon" },
    { code: 4, name: "Beban Lain-lain" },
    { code: 5, name: "Pembelian" },
    { code: 6, name: "Potongan Pembelian" },
    { code: 7, name: "Retur Pembelian dan Pengurangan Harga" },
    { code: 8, name: "Pengeluaran Outlet" },
];

// ----------------------------------------------------------------------

export default function ExpenseData() {
    const {
        dense,
        onChangeDense,
    } = useTable();

    const { themeStretch } = useSettings();

    const { enqueueSnackbar } = useSnackbar();

    const client = useQueryClient();

    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState("");

    const [openForm, setOpenForm] = useState(false);

    const [selectedCode, setSelectedCode] = useState(0);
    const [selectedId, setSelectedId] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [open, setOpen] = useState(false);

    const handleResetPage = () => {
        setController({
            ...controller,
            page: 0
        });
    }

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10,
        code: "",
        search: ""
    });

    const getData = async ({ queryKey }) => {
        const [, params] = queryKey; // Extract query params
        const queryString = new URLSearchParams(params).toString(); // Build query string
        try {
            const res = await axios.get(`/expense?${queryString}`);
            setCountData(res?.data?.totalDocs || 0);
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        }
    };

    const { isLoading, data: tableData } = useQuery(
        [
            "listExpense",
            {
                page: controller.page + 1,
                perPage: controller.rowsPerPage,
                code: controller.code || "",
                search: controller.search || ""
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

    const handleSelectedCode = (e) => {
        setSelectedCode(e.target.value);
        setController({
            page: 0,
            rowsPerPage: controller.rowsPerPage,
            search,
            code: e.target.value
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            setController({
                page: 0,
                rowsPerPage: controller.rowsPerPage,
                search,
                code: selectedCode
            });
        }
    };

    const handleDialog = (id) => {
        setSelectedId(id);
        setOpen(!open);
    };

    const handleDelete = async () => {
        setLoadingDelete(true);
        if (selectedId) {
            try {
                await axios.delete(`/expense/${selectedId}`);
                client.invalidateQueries("listExpense");
                enqueueSnackbar("Delete success!");
            } catch (error) {
                console.error(error);
                enqueueSnackbar("Delete failed!", { variant: "error" });
            }
        }
        handleDialog();
        setLoadingDelete(false);
        // get data by current page
        setController({
            ...controller,
            page: controller.page
        });
    };

    return (
        <Page title="Expense Data">
            <Container maxWidth={themeStretch ? false : "xl"}>
                <Card>
                    <Typography variant="h6" mx={1}>
                        Expense Data
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
                            <ExpenseTableToolbar
                                options={codes}
                                filterCode={selectedCode}
                                onFilterCode={handleSelectedCode}
                                filterName={search}
                                onFilterName={handleSearch}
                                onEnter={handleOnKeyPress}
                            />
                        </div>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={() => setOpenForm(true)}
                        >
                            New Expense
                        </Button>
                    </Stack>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1200, position: "relative" }}>

                            <Table size={dense ? "small" : "medium"}>
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData?.docs?.length || 0}
                                />

                                <TableBody>
                                    {!isLoading ? (
                                        <>
                                            {tableData?.docs?.map((row) => (
                                                <ExpenseTableRow
                                                    key={row._id}
                                                    row={row}
                                                    onDeleteRow={() => handleDialog(row._id)}
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
            </Container>

            <ModalExpenseForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                resetPage={handleResetPage}
            />

            <ConfirmDelete
                open={open}
                onClose={handleDialog}
                onDelete={handleDelete}
                isLoading={loadingDelete}
            />

        </Page>
    );
}
