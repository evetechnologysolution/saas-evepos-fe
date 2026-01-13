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
import axios from "src/utils/axios";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// hooks
import useSettings from "src/hooks/useSettings";
import useTable from "src/hooks/useTable";
// components
import Page from "src/components/Page";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "src/components/table";
import ConfirmDelete from "src/components/ConfirmDelete";
// utils
import BlogTableToolbar from "src/sections/@dashboard/library/blog/BlogTableToolbar";
import BlogTableRow from "src/sections/@dashboard/library/blog/BlogTableRow";
import useAuth from "src/hooks/useAuth";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center", width: 200 },
  { id: "image", label: "Image", align: "left", width: 50 },
  { id: "title", label: "Title", align: "left" },
  { id: "spoiler", label: "Spoiler", align: "left", width: 400 },
  { id: "slug", label: "Slug", align: "left", width: 300 },
  { id: "views", label: "Views", align: "left" },
  { id: "", label: "Action", align: "center" },
];

// ----------------------------------------------------------------------

export default function TableBlog() {
  const { dense, onChangeDense } = useTable();
  const { user } = useAuth();
  const role = user?.role;

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
      const res = await axios.get(`/blog?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listBlog",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        author: role === "Content Writer" ? user?._id : "",
        search: controller.search || ""
      },
    ],
    getData
  );

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      if (search) {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search,
        });
      } else {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
        });
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.content.blogEdit(paramCase(id)));
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = async () => {
    if (selectedId) {
      setLoadingDelete(true);
      try {
        await axios.delete(`/blog/${selectedId}`);
        enqueueSnackbar("Delete success!");
      } catch (error) {
        enqueueSnackbar("Terjadi kesalahan", { variant: "error" });
      } finally {
        client.invalidateQueries("listBlog");
        setLoadingDelete(false);
        handleDialog();
      }
    }
  };

  return (
    <>
      <Page title="Blog - Evewash">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Blog
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
                <BlogTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.content.blogCreate}
              >
                New Post
              </Button>
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size={dense ? "small" : "medium"}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <BlogTableRow
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

      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={loadingDelete} />
    </>
  );
}
