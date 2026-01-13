import { useState, useEffect } from "react";
// @mui
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TextField,
  Typography,
  TableContainer,
  TablePagination,
  InputAdornment
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Scrollbar from "../../../components/Scrollbar";
import Label from "../../../components/Label";
import Iconify from "../../../components/Iconify";
import { TableHeadCustom, TableNoData } from "../../../components/table";
// sections
import HistoryOrderTableRow from "./HistoryOrderTableRow";
import HistoryPointTableRow from "./HistoryPointTableRow";
import HistoryVoucherTableRow from "./HistoryVoucherTableRow";
// utils
import useAuth from "../../../hooks/useAuth";
import axios from "../../../utils/axios";
import { numberWithCommas } from "../../../utils/getData";
import { maskedPhone } from "../../../utils/masked";

// ----------------------------------------------------------------------

const ORDER_THEAD = [
  { id: "date", label: "Order Date", align: "center" },
  { id: "paymentDate", label: "Payment Date", align: "center" },
  { id: "orderId", label: "Order ID", align: "left" },
  { id: "orderType", label: "Order Type", align: "center" },
  { id: "status", label: "Status", align: "center" },
  { id: "billedAmount", label: "Total", align: "center" },
];

const POINT_THEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "description", label: "Description", align: "left" },
  { id: "point", label: "Point", align: "center" },
  { id: "expiry", label: "Expiry Date", align: "center" },
];

const VOUCHER_THEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "name", label: "Voucher", align: "left" },
  { id: "voucherCode", label: "Voucher Code", align: "left" },
  { id: "isUsed", label: "Status", align: "center" },
  { id: "expiry", label: "Expiry Date", align: "center" },
];

// ----------------------------------------------------------------------

export default function HistoryForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [countOrder, setCountOrder] = useState(0);
  const [pointData, setPointData] = useState([]);
  const [countPoint, setCountPoint] = useState(0);
  const [voucherData, setVoucherData] = useState([]);
  const [countVoucher, setCountVoucher] = useState(0);

  const [controllerOrder, setControllerOrder] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const [controllerPoint, setControllerPoint] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const [controllerVoucher, setControllerVoucher] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const isNotFoundOrder = !orderData.length;
  const isNotFoundPoint = !pointData.length;
  const isNotFoundVoucher = !voucherData.length;

  const resetData = () => {
    setData({});
    setOrderData([]);
    setCountOrder(0);
    setPointData([]);
    setCountPoint(0);
    setVoucherData([]);
    setCountVoucher(0);
  }

  const handleSearch = async () => {
    if (!search) {
      setAlert(true);
      return;
    }

    try {
      setLoading(true);
      setAlert(false);

      const res = await axios.get("/members/track", {
        params: { search }
      });

      setData(res.data);
      setIsEmpty(false)
    } catch (error) {
      if (error.message === "Data not found") {
        setIsEmpty(true);
        resetData();
      }
      // console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter" && search) {
      handleSearch();
    }
  };

  const fetchData = async (url, setResult, setCountResult) => {
    try {
      const res = await axios.get(url);
      setResult(res.data.docs);
      setCountResult(res.data.totalDocs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!data?.name) return; // Early return if member ID is not available

    const url = `/orders?page=${controllerOrder.page + 1}&perPage=${controllerOrder.rowsPerPage}&search=${data.phone}`;
    fetchData(url, setOrderData, setCountOrder);
  }, [controllerOrder, data]);

  useEffect(() => {
    if (!data?._id) return; // Early return if member ID is not available

    const url = `/point-history?page=${controllerPoint.page + 1}&perPage=${controllerPoint.rowsPerPage}&member=${data._id}`;
    fetchData(url, setPointData, setCountPoint);
  }, [controllerPoint, data]);

  useEffect(() => {
    if (!data?._id) return; // Early return if member ID is not available

    const url = `/member-vouchers?page=${controllerVoucher.page + 1}&perPage=${controllerVoucher.rowsPerPage}&member=${data._id}`;
    fetchData(url, setVoucherData, setCountVoucher);
  }, [controllerVoucher, data]);

  const handlePageChangeOrder = (event, newPage) => {
    setControllerOrder({
      ...controllerOrder,
      page: newPage
    });
  };

  const handleChangeRowsPerPageOrder = (event) => {
    setControllerOrder({
      ...controllerOrder,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  const handlePageChangePoint = (event, newPage) => {
    setControllerPoint({
      ...controllerPoint,
      page: newPage
    });
  };

  const handleChangeRowsPerPagePoint = (event) => {
    setControllerPoint({
      ...controllerPoint,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  const handleVoucherPageChange = (event, newPage) => {
    setControllerVoucher({
      ...controllerVoucher,
      page: newPage
    });
  };

  const handleVoucherChangeRowsPerPage = (event) => {
    setControllerVoucher({
      ...controllerVoucher,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 3 }} gap={2}>
          <TextField
            name="search"
            placeholder="Full Name or Phone"
            fullWidth
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleOnKeyPress}
            error={!search && alert ? Boolean(true) : Boolean(false)}
            helperText={!search && alert ? "Search value is required" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled", width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { md: "50%" } }}
          />
          <Stack direction="row" alignItems="center" gap={1}>
            <LoadingButton
              title="Search"
              variant="contained"
              loading={loading}
              onClick={() => handleSearch()}
            >
              <Iconify icon="eva:search-fill" sx={{ width: 25, height: 25 }} />
            </LoadingButton>
            <Button
              title="Reset"
              variant="contained"
              color="warning"
              sx={{ color: "white" }}
              onClick={() => {
                setSearch("");
                setIsEmpty(false);
                resetData();
              }}
            >
              <Iconify icon="mdi:reload" sx={{ width: 25, height: 25 }} />
            </Button>
          </Stack>
        </Stack>
        {isEmpty && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Data not found!</Typography>
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Member ID</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.memberId || "-"}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.name || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {!data?.phone?.includes("EM") ?
                    maskedPhone(user?.role === "Super Admin", data?.phone) || "-"
                    : "-"
                  }
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.address || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Point</Typography>
                <div>
                  <Label
                    variant="ghost"
                    color="success"
                    sx={{ minWidth: 60 }}
                  >
                    <Stack flexDirection="row" justifyContent="space-between" width="100%">
                      <Iconify icon="tabler:coin-filled" sx={{ width: 20, height: 20 }} />{" "}
                      <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.point || 0)}</Typography>
                    </Stack>
                  </Label>
                </div>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Voucher</Typography>
                <div>
                  <Label
                    variant="ghost"
                    color="warning"
                    sx={{ minWidth: 60 }}
                  >
                    <Stack flexDirection="row" justifyContent="space-between" width="100%">
                      <Iconify icon="mdi:voucher" sx={{ width: 20, height: 20 }} />{" "}
                      <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.voucher || 0)}</Typography>
                    </Stack>
                  </Label>
                </div>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* order history */}
        <div>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Order History</Typography>
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size="small">
                  <TableHeadCustom
                    headLabel={ORDER_THEAD}
                    rowCount={orderData.length}
                  />

                  <TableBody>
                    {orderData.map((row) => (
                      <HistoryOrderTableRow
                        key={row._id}
                        row={row}
                      />
                    ))}

                    <TableNoData isNotFound={isNotFoundOrder} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={countOrder}
                rowsPerPage={controllerOrder.rowsPerPage}
                page={controllerOrder.page}
                onPageChange={handlePageChangeOrder}
                onRowsPerPageChange={handleChangeRowsPerPageOrder}
              />
            </Box>
          </Box>
        </div>

        {/* point history */}
        <div>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Point History</Typography>
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size="small">
                  <TableHeadCustom
                    headLabel={POINT_THEAD}
                    rowCount={pointData.length}
                  />

                  <TableBody>
                    {pointData.map((row) => (
                      <HistoryPointTableRow
                        key={row._id}
                        row={row}
                      />
                    ))}

                    <TableNoData isNotFound={isNotFoundPoint} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={countPoint}
                rowsPerPage={controllerPoint.rowsPerPage}
                page={controllerPoint.page}
                onPageChange={handlePageChangePoint}
                onRowsPerPageChange={handleChangeRowsPerPagePoint}
              />
            </Box>
          </Box>
        </div>

        {/* voucher history */}
        <div>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Voucher History</Typography>
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size="small">
                  <TableHeadCustom
                    headLabel={VOUCHER_THEAD}
                    rowCount={voucherData.length}
                  />

                  <TableBody>
                    {voucherData.map((row) => (
                      <HistoryVoucherTableRow
                        key={row._id}
                        row={row}
                      />
                    ))}

                    <TableNoData isNotFound={isNotFoundVoucher} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={countVoucher}
                rowsPerPage={controllerVoucher.rowsPerPage}
                page={controllerVoucher.page}
                onPageChange={handleVoucherPageChange}
                onRowsPerPageChange={handleVoucherChangeRowsPerPage}
              />
            </Box>
          </Box>
        </div>
      </Card>
    </>
  );
}
