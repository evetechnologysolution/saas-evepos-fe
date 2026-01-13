import { useState } from "react";
import { useQuery } from "react-query";
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
  Stack,
  Typography,
} from "@mui/material";
import axios from "../../../utils/axios";
// hooks
import useSettings from "../../../hooks/useSettings";
import useTable from "../../../hooks/useTable";
// components
import Page from "../../../components/Page";
import Scrollbar from "../../../components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";
// sections
import { BazaarLogVoucherTableToolbar, BazaarLogVoucherTableRow } from "./sections";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "usedAt", label: "Used At", align: "center" },
  { id: "name", label: "Voucher Name", align: "left" },
  { id: "voucherCode", label: "Voucher Code", align: "left" },
  { id: "voucherType", label: "Voucher Type", align: "left" },
  { id: "", label: "Member ID", align: "left" },
  { id: "", label: "Name", align: "left" },
  { id: "", label: "Phone", align: "left" }
];

// ----------------------------------------------------------------------

export default function BazaarLogVoucher() {
  const {
    dense,
    onChangeDense,
  } = useTable();

  const { themeStretch } = useSettings();

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
      const res = await axios.get(`/member-vouchers?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listBazaarLogVoucher",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        status: "used-log",
        sortBy: "usedAt",
        bazaar: "yes",
        search: controller.search || "",
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
      if (search) {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search
        });
      } else {
        setController({
          page: 0,
          rowsPerPage: controller.rowsPerPage,
          search: ""
        });
      }
    }
  };

  return (
    <>
      <Page title="Bazaar: Log Voucher">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Bazaar Log Voucher
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
                <BazaarLogVoucherTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
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
                          <BazaarLogVoucherTableRow
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
