import React, { useState, useRef } from "react";
import { useQuery } from "react-query";
import { CSVLink } from "react-csv";
// @mui
import {
  styled,
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// utils
import axios from "../../../utils/axios";
import { fCurrency } from "../../../utils/formatNumber";
import { formatQDate, formatDate, formatDate2, formatOnlyDate } from "../../../utils/getData";
// components
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Label from "../../../components/Label";
import { TableHeadCustom, TableLoading, TableNoData } from "../../../components/table";

// ----------------------------------------------------------------------

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

const TABLE_HEAD = [
  { id: "no", label: "No", align: "left" },
  // { id: "date", label: "Order Date", align: "left" },
  { id: "paymentDate", label: "Payment Date", align: "left" },
  { id: "orderId", label: "Order ID", align: "left" },
  { id: "", label: "Customer", align: "left" },
  { id: "orders", label: "Orders", align: "left" },
  { id: "deliveryPrice", label: "Delivery Fee", align: "left" },
  { id: "total", label: "Total", align: "left" },
  { id: "payment", label: "Payment", align: "left" },
];

export default function TableComponent() {

  const [countData, setCountData] = useState(0);
  const [pagingCounter, setPagingCounter] = useState(0);
  const [search, setSearch] = useState("");

  const headers = ["Payment Date", "Order ID", "Order Type", "Item", "Price", "Qty", "Discount", "Delivery Fee", "Total", "Payment"];
  const exportCsv = useRef(null);
  const [exportData, setExportData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: "",
    start: "",
    end: ""
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/orders/paid?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      setPagingCounter(res?.data?.pagingCounter || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data: tableData } = useQuery(
    [
      "listPaidOrders",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
        // start: controller.start || "",
        // end: controller.end || "",
        paidStart: controller.start || "",
        paidEnd: controller.end || "",
        sortBy: "paymentDate",
        sortType: "desc"
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

  const handleSearch = () => {
    let params = {
      page: 0,
      rowsPerPage: controller.rowsPerPage,
    }

    if (search) {
      params = {
        ...params,
        search
      }
    }

    if (startDate && endDate) {
      params = {
        ...params,
        start: formatQDate(startDate),
        end: formatQDate(endDate)
      }
    }

    setController(params);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search: "",
      start: "",
      end: "",
    });
  };

  const handleClickSearch = () => {
    handleSearch();
  };

  const showOrderType = (orderType) => {
    if (orderType?.toLowerCase() === "onsite") {
      return "Onsite";
    }
    return "Delivery";
  }

  const handleExport = async () => {
    setLoadingExport(true);

    handleSearch();

    let url = `/orders/export`;
    if (search) {
      url = `${url}?search=${search}`;
    }
    if (startDate && endDate) {
      const sign = search ? "&" : "?";
      // url = `${url + sign}start=${startDate}&end=${endDate}`;
      url = `${url + sign}paidStart=${startDate}&paidEnd=${endDate}&sortBy=paymentDate&sortType=desc`;
    }

    const result = [];
    await axios.get(url).then((response) => {
      response.data.forEach((data) => {
        let payment;
        if (!data.refundType) {
          if (data.payment === "Card") {
            payment = `${data.payment} | ${data.cardBankName} a/n ${data.cardAccountName} ${data.cardNumber}`;
          } else {
            payment = data.payment;
          }
        } else {
          payment = "Refund";
        }
        result.push([
          // formatOnlyDate(data.date),
          formatDate2(data.paymentDate),
          data.orderId || data._id,
          showOrderType(data.orderType),
          data.orders[0].name,
          data.orders[0].price,
          data.orders[0].qty,
          data.discountPrice ? data.discountPrice : 0,
          data.deliveryPrice ? data.deliveryPrice : 0,
          data.billedAmount,
          payment
        ]);

        if (data.orders.length > 1) {
          data.orders.forEach((row, i) => {
            if (i > 0) {
              result.push([
                // "",
                "",
                "",
                "",
                row.name,
                row.price,
                row.qty,
                "",
                "",
                "",
                ""
              ]);
            }
          })
        }
      });
    });

    setExportData(result);

    setTimeout(() => {
      if (result.length > 0) {
        exportCsv.current.link.click();
      } else {
        alert("Export failed because data is empty!");
      }
      setLoadingExport(false);
    }, 1000);
  };

  return (
    <Card>
      <Box sx={{ px: 2 }}>
        <Box sx={{ px: 1, py: 2 }}>
          <HeaderBreadcrumbs
            heading="Sales Report"
            links={[]}
          />
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid item xs={12} sm={6} md="auto">
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
            </Grid>

            <Grid item xs={12} sm={6} md="auto">
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
            </Grid>

            <Grid item xs={12} sm>
              <TextField
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID"
                onKeyDown={handleOnKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={"eva:search-fill"} sx={{ color: "text.disabled", width: 20, height: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs="auto">
              <Button variant="contained" color="warning" sx={{ color: "white" }} title="Reset" onClick={() => handleReset()}>
                {/* Reset */}
                <Iconify icon={"mdi:reload"} sx={{ width: 25, height: 25 }} />
              </Button>
              <Button variant="contained" title="Search" sx={{ ml: 1 }} onClick={() => handleClickSearch()}>
                {/* Search */}
                <Iconify icon={"eva:search-fill"} sx={{ width: 25, height: 25 }} />
              </Button>
              <CSVLink
                filename={`Export-Orders-${formatDate(new Date())}`}
                separator=";"
                data={exportData}
                headers={headers}
                ref={exportCsv}
              />
              <LoadingButton variant="contained" color="info" title="Export" sx={{ ml: 1 }} loading={loadingExport} onClick={() => handleExport()}>
                {/* Export */}
                <Iconify icon={"material-symbols:download-rounded"} sx={{ width: 25, height: 25 }} />
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: "relative" }}>
            <Table size="small">
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={countData}
              />

              <TableBody>
                {!isLoading ? (
                  <>
                    {tableData?.docs?.map((row, index) => (
                      <CustomTableRow hover key={index}>
                        <TableCell>{pagingCounter + index}</TableCell>
                        {/* <TableCell>{formatDate2(row.date)}</TableCell> */}
                        <TableCell>{row.paymentDate ? formatDate2(row.paymentDate) : "-"}</TableCell>
                        <TableCell>
                          <Label
                            variant="ghost"
                            color={showOrderType(row.orderType) === "Onsite" ? "default" : "info"}
                          >
                            {showOrderType(row.orderType)}
                          </Label>
                          <p>{row.orderId ? row.orderId : row._id}</p>
                        </TableCell>
                        <TableCell align="left">
                          <p>{row.customer?.name || "-"}</p>
                          <p>
                            {row.customer?.phone && !row.customer?.phone?.includes("EM")
                              ? row.customer?.phone
                              : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          {row.orders.map((item, i) => (
                            <p key={i} style={{ marginBottom: "5px" }}>
                              {`x ${item.qty}${item.category?.toLowerCase() === "kiloan" ? "kg" : ""} ${item.name}`}
                              {item.variant.length > 0 && item.variant.map((item, v) => (
                                <span key={v}>
                                  <br />
                                  <em>{`${item.name} : ${item.option} ${item.qty > 1 ? `(x${item.qty})` : ""}`}</em>
                                </span>
                              ))}
                            </p>
                          ))}
                        </TableCell>
                        <TableCell>{row.deliveryPrice ? fCurrency(row.deliveryPrice) : "-"}</TableCell>
                        <TableCell sx={{ color: row.refundType ? "red" : "#212B36" }}>{fCurrency(row.billedAmount)}</TableCell>
                        <TableCell sx={{ color: row.refundType ? "red" : "#212B36" }}>
                          {row.refundType && "Refund"}
                          {!row.refundType && (
                            <div>
                              {row.payment}
                              {row.payment === "Card" && (
                                <div style={{ fontSize: "13px" }}>
                                  {row.cardBankName}
                                  <br />
                                  {row.cardAccountName}
                                  <br />
                                  {row.cardNumber}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </CustomTableRow>
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
        </Box>
      </Box>
    </Card >
  );
}