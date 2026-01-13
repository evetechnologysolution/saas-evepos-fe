import { paramCase } from "change-case";
import { useState, useEffect } from "react";
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
// sections
import { GalleryTableRow, GalleryTableToolbar } from "src/sections/@dashboard/library/gallery";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "name", label: "Name", align: "left" },
  { id: "image", label: "Image", align: "left" },
  { id: "", label: "Url", align: "left" },
  { id: "", label: "Action", align: "center" },
];

// ----------------------------------------------------------------------

export default function TableGallery() {
  const { dense, onChangeDense } = useTable();

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
      const res = await axios.get(`/gallery?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listGallery",
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
      setController({
        page: 0,
        rowsPerPage: controller.rowsPerPage,
        search,
      });

    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.content.galleryEdit(paramCase(id)));
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = async () => {
    if (selectedId) {
      setLoadingDelete(true);
      try {
        await axios.delete(`/gallery/${selectedId}`);
        client.invalidateQueries("listGallery");
        enqueueSnackbar("Delete success!");
      } catch (error) {
        enqueueSnackbar("Terjadi kesalahan", { variant: "error" });
      } finally {
        setLoadingDelete(false);
        handleDialog();
      }
    }
  };

  return (
    <>
      <Page title="Gallery - Evewash">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Gallery
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
                <GalleryTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.content.galleryCreate}
              >
                New Image
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
                          <GalleryTableRow
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
