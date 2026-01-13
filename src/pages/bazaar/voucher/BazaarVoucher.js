import React, { useState } from "react";
import { paramCase } from "change-case";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// @mui
import {
  Container,
  Button,
  Card,
  TableContainer,
  Table,
  TableBody,
  Box,
  TablePagination,
  FormControlLabel,
  Switch,
  Stack,
  Typography,
} from "@mui/material";

import axios from "../../../utils/axios";

// routes
import { PATH_DASHBOARD } from "../../../routes/paths";

// hooks
import useAuth from "../../../hooks/useAuth";
import useSettings from "../../../hooks/useSettings";
import useTable from "../../../hooks/useTable";

// components
import Scrollbar from "../../../components/Scrollbar";
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";
import ConfirmDelete from "../../../components/ConfirmDelete";

// section
import { BazaarVoucherTableToolbar, BazaarVoucherTableRow } from "./sections";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "name", label: "Voucher Name", align: "left" },
  { id: "voucherType", label: "Voucher Type", align: "left" },
  { id: "worthPoint", label: "Point", align: "center" },
  { id: "", label: "Quota", align: "center" },
  { id: "", label: "Valid Until", align: "center" },
  { id: "isAvailable", label: "Status", align: "center" },
  { id: "", label: "Action", align: "center" },
];

// ----------------------------------------------------------------------

export default function BazaarVoucherList() {
  const {
    dense,
    onChangeDense,
  } = useTable();

  const { user } = useAuth();

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
      const res = await axios.get(`/vouchers?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listVoucherBazaar",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
        bazaar: "yes",
        sort: "date:desc",
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
    navigate(PATH_DASHBOARD.bazaar.voucherEdit(paramCase(id)));
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    if (selectedId) {
      await axios.delete(`/vouchers/${selectedId}`);
      client.invalidateQueries("listVoucherBazaar");
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
      <Page title="Voucher">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Voucher Bazaar
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
                <BazaarVoucherTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.bazaar.voucherCreate}
              >
                New Voucher
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
                          <BazaarVoucherTableRow
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
        isLoading={loadingDelete}
      />
    </>
  );
}
