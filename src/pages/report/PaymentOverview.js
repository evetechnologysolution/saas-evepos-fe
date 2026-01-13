import React, { useEffect, useState } from "react";
// @mui
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Stack,
  Typography,
  InputAdornment
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import moment from "moment";
// utils
import axios from "../../utils/axios";
import { numberWithCommas } from "../../utils/getData";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
// sections
import {
  WidgetSummary,
  RevenueOverview,
} from "../../sections/@dashboard/app";

// ----------------------------------------------------------------------

export default function PaymentOverview() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [filterLabel, setFilterLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentToday, setPaymentToday] = useState(null);
  const [paymentThisWeek, setPaymentThisWeek] = useState(null);
  const [paymentThisMonth, setPaymentThisMonth] = useState(null);
  const [paymentThisYear, setPaymentThisYear] = useState(null);

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const options = [
    "Today", "This Week", "This Month", "This Year",
    // "By Date"
  ];

  useEffect(() => {
    if (filterLabel === "Today") {
      setPaymentMethod(paymentToday);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Week") {
      setPaymentMethod(paymentThisWeek);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Month") {
      setPaymentMethod(paymentThisMonth);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Year") {
      setPaymentMethod(paymentThisYear);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "By Date") {
      setShowFilterDate(true);
    }
  }, [filterLabel]);

  const handleSearch = async () => {
    try {
      if (startDate && endDate) {
        const revenueResponse = await axios.get(`/report/revenue-overview/date?start=${startDate}&end=${endDate}`);

        setPeriod(`(${moment(startDate).format("DD MMMM YYYY")} - ${moment(endDate).format("DD MMMM YYYY")})`);
        setPaymentMethod(revenueResponse.data[0]);
      }
    } catch (error) {
      console.log(error);
      setPaymentMethod([]);
    }
  };

  const handleReset = () => {
    setPeriod("");
    setStartDate(null);
    setEndDate(null);
  };

  const fetchDataReport = async () => {
    try {
      const [
        paymentToday,
        paymentWeek,
        paymentMonth,
        paymentYear,
      ] = await Promise.all([
        axios.get("/report/revenue-overview/today"),
        axios.get("/report/revenue-overview/this-week"),
        axios.get("/report/revenue-overview/this-month"),
        axios.get("/report/revenue-overview/this-year"),
      ]);
      setPaymentToday(paymentToday.data[0]);
      setPaymentThisWeek(paymentWeek.data[0]);
      setPaymentThisMonth(paymentMonth.data[0]);
      setPaymentThisYear(paymentYear.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataReport();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h6" mx={1}>
          Payment Overview
        </Typography>

        <Stack
          flexDirection="row"
          my={3}
          gap={1}
          p={0.5}
          borderRadius="8px"
          border="2px solid #EBEEF2"
          width="fit-content"
        >
          {options.map((item, i) => (
            <Button
              key={i}
              sx={{
                boxShadow: 0,
                color: filterLabel === item ? theme.palette.primary.main : theme.palette.grey[400],
                bgcolor: filterLabel === item ? theme.palette.primary.lighter : "",
              }}
              size="large"
              onClick={() => setFilterLabel(item)}
            >
              {item}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={4}>
          {showFilterDate && (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                <Grid item xs={12} sm="auto">
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

                <Grid item xs={9} sm="auto">
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

                <Grid item xs={3} sm="auto">
                  {/* <Button variant="contained" color="warning" sx={{ color: "white", mr: 1 }} title="Reset" onClick={() => handleReset()}>
                    <Iconify icon={"mdi:reload"} sx={{ width: 25, height: 25 }} />
                  </Button> */}
                  <Button
                    variant="contained"
                    title="Search"
                    disabled={startDate && endDate ? Boolean(false) : Boolean(true)}
                    onClick={() => handleSearch()}
                  >
                    <Iconify icon={"eva:search-fill"} sx={{ width: 25, height: 25 }} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <RevenueOverview
                sx={{
                  padding: "0.5vw",
                }}
                title="Payment Method Overview"
                subheader={`${filterLabel} ${period}`}
                chartData={[
                  {
                    label: paymentMethod?.label?.[1] || "Cash",
                    value: paymentMethod?.value?.[1] || 0
                  },
                  {
                    label: paymentMethod?.label?.[5] || "QRIS",
                    value: paymentMethod?.value?.[5] || 0
                  },
                  {
                    label: paymentMethod?.label?.[3] || "Bank Transfer",
                    value: paymentMethod?.value?.[3] || 0
                  },
                  {
                    label: paymentMethod?.label?.[0] || "Card",
                    value: paymentMethod?.value?.[0] || 0
                  },
                  {
                    label: paymentMethod?.label?.[2] || "E-Wallet",
                    value: paymentMethod?.value?.[2] || 0
                  },
                  {
                    label: paymentMethod?.label?.[4] || "Online Payment",
                    value: paymentMethod?.value?.[4] || 0
                  },
                ]}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.primary.light,
                  theme.palette.primary.dark,
                ]}
                chartType="donut"
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[1] || "Cash"}
                  total={paymentMethod?.value?.[1] || 0}
                  type="currency"
                  color="warning"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[5] || "QRIS"}
                  total={paymentMethod?.value?.[5] || 0}
                  type="currency"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[3] || "Bank Transfer"}
                  total={paymentMethod?.value?.[3] || 0}
                  type="currency"
                  color="success"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[0] || "Card"}
                  total={paymentMethod?.value?.[0] || 0}
                  type="currency"
                  color="success"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[2] || "E-Wallet"}
                  total={paymentMethod?.value?.[2] || 0}
                  type="currency"
                  color="success"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={6}>
                <WidgetSummary
                  title={paymentMethod?.label?.[4] || "Online Payment"}
                  total={paymentMethod?.value?.[4] || 0}
                  type="currency"
                  color="success"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Stack flexDirection="row" justifyContent="space-between" bgcolor={theme.palette.primary.lighter} borderRadius={1} p={2} gap={3}>
              <Typography variant="h6" color="#637381">Total</Typography>
              <Typography variant="h6" color="#637381">
                Rp. {numberWithCommas(
                  paymentMethod?.value?.[0] + paymentMethod?.value?.[1] + paymentMethod?.value?.[2] +
                  paymentMethod?.value?.[3] + paymentMethod?.value?.[4] || 0
                )}
              </Typography>
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
