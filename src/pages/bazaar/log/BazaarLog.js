import React, { useState } from "react";
import { useQuery } from "react-query";
// @mui
import {
  Container,
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

// hooks
import useSettings from "../../../hooks/useSettings";
import useTable from "../../../hooks/useTable";

// components
import Scrollbar from "../../../components/Scrollbar";
import Page from "../../../components/Page";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";

// section
import { BazaarLogTableToolbar, BazaarLogTableRow } from "./sections";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "", label: "Date", align: "center" },
  { id: "", label: "Visitor", align: "left" },
  { id: "", label: "Notes", align: "center" },
  { id: "", label: "Stand Bazaar / Voucher Name", align: "left" },
  { id: "", label: "Point", align: "center" },
];

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Scan", value: "no" },
  { label: "Redeem", value: "yes" },
];

// ----------------------------------------------------------------------

export default function BazaarLogList() {
  const {
    dense,
    onChangeDense,
  } = useTable();

  const { themeStretch } = useSettings();

  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    redeem: "",
    search: ""
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/bazaar/log?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listBazaarLog",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
        redeem: controller.redeem || ""
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

  const handleFilterStatus = (event) => {
    const { value } = event.target;
    setSelectedStatus(value);
    setController({
      ...controller,
      page: 0,
      redeem: value !== "all" ? value : "",
    });
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

  return (
    <>
      <Page title="Log Bazaar">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Log Bazaar
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
                <BazaarLogTableToolbar
                  filterName={search}
                  onFilterName={handleSearch}
                  filterStatus={selectedStatus}
                  onFilterStatus={handleFilterStatus}
                  optionsStatus={FILTER_OPTIONS}
                  onEnter={handleOnKeyPress}
                />
              </div>
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
                          <BazaarLogTableRow
                            key={row._id}
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
        </Container>
      </Page>
    </>
  );
}
