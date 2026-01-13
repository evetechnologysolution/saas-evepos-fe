import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// @mui
import {
  Box,
  Button,
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MemberCardsTableRow from "src/sections/@dashboard/member/member-card/MemberCardsTableRow";
import MemberCardsToolbar from "src/sections/@dashboard/member/member-card/MemberCardsToolbar";
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
import GenerateCardID from "./modalGenerateCardId";
// sections

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["All", "Used", "Empty"];

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center", width: 130 },
  {
    id: "", label: "Card ID", align: "left", width: 80
  },
  {
    id: "", label: "QR", align: "center", width: 80
  },
  { id: "", label: "Action", align: "center", width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierOrders() {
  const { dense, onChangeDense } = useTable();

  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();

  const [filterStatus, setFilterStatus] = useState("All");
  const [countData, setCountData] = useState(0);
  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [open, setOpen] = useState(false);

  const [openGenerateCardId, setOpenGenerateCardId] = useState(false);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    filter: "",
    search: "",
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey;
    const queryString = new URLSearchParams(params).toString();
    try {
      const res = await axios.get(`/member-card?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "memberCards",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        filter: controller.status || "",
        search: controller.search || "",
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

  const handleFilterStatus = (val) => {
    const fixStatus = val?.toLowerCase();
    setFilterStatus(val);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search,
      status: val !== "All" ? fixStatus : "",
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
        status: controller.status,
        search,
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
      await axios.delete(`/orders/${selectedId}`);
      client.invalidateQueries("listOrders");
      enqueueSnackbar("Delete success!");
    }
    handleDialog();
    setLoadingDelete(false);
    // get data by current page
    setController({
      ...controller,
      page: controller.page,
    });
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
            <Typography variant="h6">Member Cards</Typography>
            {/* <Stack flexDirection={{ sm: "row" }} alignItems={{ sm: "center" }} minWidth={user?.role === "Super Admin" ? "50%" : "40%"}> */}
            <Stack flexDirection={{ sm: "row" }} alignItems={{ sm: "center" }} minWidth="50%">
              {/* {user?.role === "Super Admin" && ( */}
              <Stack
                flexDirection="row"
                gap={1}
                p={0.5}
                mx={1}
                borderRadius="8px"
                border="1px solid #E4E7EA"
                width="fit-content"
                height="fit-content"
              >
                {STATUS_OPTIONS.map((item, i) => (
                  <Button
                    key={i}
                    sx={{
                      boxShadow: 0,
                      color: filterStatus === item ? theme.palette.primary.main : theme.palette.grey[400],
                      bgcolor: filterStatus === item ? theme.palette.primary.lighter : "",
                      textTransform: "capitalize",
                    }}
                    size="large"
                    onClick={() => handleFilterStatus(item)}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
              {/* )} */}
              <div style={{ width: "100%" }}>
                <MemberCardsToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
              </div>
              <Button
                size="large"
                type="button"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => setOpenGenerateCardId(true)}
              >
                Add
              </Button>
            </Stack>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200, position: "relative" }}>
              <Table size={dense ? "small" : "medium"}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                <TableBody>
                  {!isLoading ? (
                    <>
                      {tableData?.docs?.map((row) => (
                        <MemberCardsTableRow key={row._id} row={row} onDeleteRow={() => handleDialog(row._id)} />
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

      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={loadingDelete} />
      <GenerateCardID open={openGenerateCardId} onClose={() => setOpenGenerateCardId(false)} />
    </Page>
  );
}
