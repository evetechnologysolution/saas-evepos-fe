import { useState } from "react";
import { useQuery } from "react-query";
// @mui
import {
  Box,
  Card,
  Table,
  Stack,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import axios from "../../utils/axios";
// hooks
import useSettings from "../../hooks/useSettings";
import useTable from "../../hooks/useTable";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import { TableHeadCustom, TableLoading, TableNoData } from "../../components/table";
import Iconify from "../../components/Iconify";
// sections
import { PrintCountTableToolbar, PrintCountTableRow } from "../../sections/@dashboard/cashier/print-count";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center", width: 130 },
  { id: "", label: "Order ID", align: "left", width: 80 },
  { id: "", label: "Customer", align: "left", width: 80 },
  { id: "", label: "Receipt Count", align: "center", width: 80 },
  { id: "", label: "Laundry Count", align: "center", width: 80 },
  { id: "", label: "Action", align: "center", width: 80 },
];

// ----------------------------------------------------------------------

export default function PrintCount() {
  const {
    dense,
    onChangeDense,
  } = useTable();

  const { themeStretch } = useSettings();

  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState("");

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: ""
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/orders?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listPrint",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
        // printCount: controller.printCount || "",
        printLaundry: controller.printCount || "",
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
        search: search || "",
        printCount: count || ""
      });
    }
  };

  return (
    <Page title="Orders">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Card>
          <Stack
            flexDirection={{ sm: "row" }}
            flexWrap="wrap"
            alignItems={{ sm: "center" }}
            justifyContent={{ sm: "space-between" }}
            mx={1}
          >
            <Stack
              gap={2}
              flexDirection="row"
              flexWrap="wrap"
              alignItems="center"
            // justifyContent={{ sm: "space-between" }}
            >
              <Typography variant="h6">
                Laundry Count
              </Typography>
              <div style={{ width: "40%" }}>
                <TextField
                  fullWidth
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  onKeyDown={handleOnKeyPress}
                  placeholder="Count"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="weui:arrow-filled" sx={{ color: "text.disabled", width: 20, height: 20 }} />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </div>
            </Stack>
            <div style={{ minWidth: "40%" }}>
              <PrintCountTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
            </div>
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
                        <PrintCountTableRow
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
  );
}
