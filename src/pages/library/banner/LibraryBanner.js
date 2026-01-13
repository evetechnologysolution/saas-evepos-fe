import { paramCase } from "change-case";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// @mui
import {
    Box,
    Card,
    Table,
    Switch,
    TableBody,
    Container,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import axios from "../../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
import useTable from "../../../hooks/useTable";
// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";
import ConfirmDelete from "../../../components/ConfirmDelete";
// sections
import { BannerTableToolbar, BannerTableRow } from "../../../sections/@dashboard/library/banner";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "date", label: "Date", align: "center" },
    { id: "name", label: "Name", align: "left" },
    // { id: "price", label: "Price", align: "center" },
    { id: "listNumber", label: "List Number", align: "center" },
    { id: "isAvailable", label: "Status", align: "center" },
    { id: "", label: "Action", align: "center" },
];

// ----------------------------------------------------------------------

export default function LibraryBanner() {
    const {
        dense,
        onChangeDense,
    } = useTable();

    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const client = useQueryClient();

    const [selectedId, setSelectedId] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [open, setOpen] = useState(false);

    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState("");

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10,
        search: ""
    });

    const getData = async ({ queryKey }) => {
        const [, params] = queryKey; // Extract query params
        const queryString = new URLSearchParams(params).toString(); // Build query string
        try {
            const res = await axios.get(`/banners?${queryString}`);
            setCountData(res?.data?.totalDocs || 0);
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        }
    };

    const { isLoading, data: tableData } = useQuery(
        [
            "listBanner",
            {
                page: controller.page + 1,
                perPage: controller.rowsPerPage,
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

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            setController({
                page: 0,
                rowsPerPage: controller.rowsPerPage,
                search
            });
        }
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.library.bannerEdit(paramCase(id)));
    };

    const handleDialog = (id) => {
        setSelectedId(id);
        setOpen(!open);
    };

    const handleDelete = async () => {
        setLoadingDelete(true);
        if (selectedId) {
            await axios.delete(`/banners/${selectedId}`);
            client.invalidateQueries("listBanner");
            enqueueSnackbar("Delete success!");
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
        <>
            <Page title="Banner">
                <Container maxWidth={themeStretch ? false : "xl"}>
                    <Card>
                        <Typography variant="h6" mx={1}>
                            Banner
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
                                <BannerTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
                            </div>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                component={RouterLink}
                                to={PATH_DASHBOARD.library.bannerCreate}
                            >
                                New Banner
                            </Button>
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
                                                {tableData?.docs?.map((row) => (
                                                    <BannerTableRow
                                                        key={row._id}
                                                        row={row}
                                                        onEditRow={() => handleEditRow(row._id)}
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
            </Page>

            <ConfirmDelete
                open={open}
                onClose={handleDialog}
                onDelete={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}
