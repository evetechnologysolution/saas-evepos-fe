import { useState, useEffect } from "react";
// @mui
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Scrollbar from "../../../../components/Scrollbar";
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
import { TableHeadCustom, TableNoData } from "../../../../components/table";
// sections
import HistoryOrderTableRow from "./HistoryOrderTableRow";
// utils
import axios from "../../../../utils/axios";
import { numberWithCommas } from "../../../../utils/getData";

// ----------------------------------------------------------------------

const ORDER_THEAD = [
  { id: "date", label: "Order Date", align: "center" },
  { id: "paymentDate", label: "Payment Date", align: "center" },
  { id: "orderId", label: "Order ID", align: "left" },
  { id: "customer", label: "Customer", align: "left" },
  { id: "firstOrder", label: "Customer Status", align: "center" },
  { id: "status", label: "Status", align: "center" },
  { id: "billedAmount", label: "Total", align: "center" },
];

// ----------------------------------------------------------------------

export default function HistoryForm() {
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [countOrder, setCountOrder] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [controllerOrder, setControllerOrder] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const isNotFoundOrder = !orderData.length;

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

  const resetData = (e) => {
    setData({});
    setOrderData([]);
    setCountOrder(0);
    setStartDate(null);
    setEndDate(null);

    handlePageChangeOrder(e, 0);
  }

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      return;
    }

    try {
      setLoading(true);

      // Melakukan permintaan API paralel
      const [res1, res2] = await Promise.all([
        axios.get("/orders/track-count", { params: { start: startDate, end: endDate } }),
        axios.get("/orders/track", { params: { start: startDate, end: endDate, perPage: 25 } }),
      ]);

      // Validasi hasil respons
      if (!res1.data || !res2.data || res2.data.docs.length === 0) {
        setIsEmpty(true);
        resetData();
        return;
      }

      setData(res1.data);
      setOrderData(res2.data.docs);
      setCountOrder(res2.data.totalDocs);
      setIsEmpty(false);

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

  useEffect(() => {
    const getData = async () => {
      try {
        await axios.get("/orders/track", {
          params: {
            start: startDate,
            end: endDate,
            page: controllerOrder.page + 1,
            perPage: controllerOrder.rowsPerPage
          }
        }).then((response) => {
          setOrderData(response.data.docs);
          setCountOrder(response.data.totalDocs);
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (startDate && endDate) {
      getData();
    }
  }, [controllerOrder]);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 3 }} gap={2}>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Start Date"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <img src="/assets/calender-icon.svg" alt="icon" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="End Date"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <img src="/assets/calender-icon.svg" alt="icon" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
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

        <Stack spacing={3} direction="row">
          <Stack>
            <Typography variant="subtitle2">Total</Typography>
            <div>
              <Label
                variant="ghost"
                color="primary"
                sx={{ minWidth: 60 }}
              >
                <Stack flexDirection="row" justifyContent="space-between" width="100%">
                  <Iconify icon="solar:user-id-bold" sx={{ width: 20, height: 20 }} />{" "}
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.new + data?.old || 0)}</Typography>
                </Stack>
              </Label>
            </div>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">Baru</Typography>
            <div>
              <Label
                variant="ghost"
                color="success"
                sx={{ minWidth: 150 }}
              >
                <Stack flexDirection="row" justifyContent="space-between" width="100%">
                  <Iconify icon="solar:user-id-bold" sx={{ width: 20, height: 20 }} />{" "}
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.new || 0)}</Typography>
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{`(${((data?.new / (data?.new + data?.old)) * 100 || 0).toFixed(2)}%)`}</Typography>
                </Stack>
              </Label>
            </div>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">Lama</Typography>
            <div>
              <Label
                variant="ghost"
                color="warning"
                sx={{ minWidth: 150 }}
              >
                <Stack flexDirection="row" justifyContent="space-between" width="100%">
                  <Iconify icon="solar:user-id-bold" sx={{ width: 20, height: 20 }} />{" "}
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.old || 0)}</Typography>
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{`(${((data?.old / (data?.new + data?.old)) * 100 || 0).toFixed(2)}%)`}</Typography>
                </Stack>
              </Label>
            </div>
          </Stack>
        </Stack>

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

      </Card >
    </>
  );
}
