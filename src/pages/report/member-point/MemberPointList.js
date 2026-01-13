import { paramCase } from "change-case";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
import useTable from "../../../hooks/useTable";
// components
import Page from "../../../components/Page";
import Scrollbar from "../../../components/Scrollbar";
import Label from "../../../components/Label";
import Iconify from "../../../components/Iconify";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";
import { numberWithCommas } from "../../../utils/getData";
// sections
import { MemberPointTableToolbar, MemberPointTableRow } from "./sections";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "memberId", label: "Member ID", align: "center" },
  { id: "name", label: "Name", align: "left" },
  { id: "phone", label: "Phone", align: "left" },
  { id: "email", label: "Email", align: "left" },
  // { id: "", label: "Address", align: "left", width: 400 },
  { id: "latestOrder.date", label: "Latest Order", align: "center" },
  { id: "point", label: "Point", align: "center" },
];

// ----------------------------------------------------------------------

export default function MemberPointList() {
  const {
    dense,
    order,
    orderBy,
    onSort,
    onChangeDense,
  } = useTable({
    defaultOrderBy: "point",
    defaultOrder: "desc"
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState("");

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    sort: "point:desc",
    search: ""
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/members/point?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listMemberPoint",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        sort: controller.sort || "point:desc",
        search: controller.search || "",
      },
    ],
    getData
  );

  const handlePageChange = (event, newPage) => {
    setController(prev => ({
      ...prev,
      page: newPage
    }));
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

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.report.memberPointView(paramCase(id)));
  };

  useEffect(() => {
    setController(prev => ({
      ...prev,
      page: 0,
      sort: `${orderBy}:${order}`
    }));
  }, [order, orderBy]);

  return (
    <>
      <Page title="Member">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Card>
            <Typography variant="h6" mx={1}>
              Member Point
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
                <MemberPointTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Stack alignItems="end">
                <Typography variant="subtitle2">Total Point</Typography>
                <div>
                  <Label
                    variant="ghost"
                    color="success"
                    sx={{ minWidth: 60 }}
                  >
                    <Stack flexDirection="row" justifyContent="space-between" width="100%">
                      <Iconify icon="tabler:coin-filled" sx={{ width: 20, height: 20 }} />{" "}
                      <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(tableData?.totalPoint || 0)}</Typography>
                    </Stack>
                  </Label>
                </div>
              </Stack>
            </Stack>


            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size={dense ? "small" : "medium"}>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.docs?.length || 0}
                    order={order}
                    orderBy={orderBy}
                    onSort={onSort}
                  />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <MemberPointTableRow
                            key={row._id}
                            row={row}
                            onDetailRow={() => handleDetailRow(row._id)}
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
