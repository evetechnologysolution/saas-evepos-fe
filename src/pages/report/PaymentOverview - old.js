import React, { useEffect, useContext, useState } from "react";
// @mui
import {
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  InputAdornment
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import moment from "moment";
import axios from "../../utils/axios";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import {
  YearlyWidgetSummary,
  RevenueOverview,
} from "../../sections/@dashboard/app";
// context
import { dashboardContext } from "../../contexts/DashboardContext";

// ----------------------------------------------------------------------

export default function PaymentOverview() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const ctx = useContext(dashboardContext);

  const [filterLabel, setFilterLabel] = useState("This Month");
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (filterLabel === "Today") {
      setPaymentMethod(ctx.paymentRevenueToday);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Week") {
      setPaymentMethod(ctx.paymentRevenueThisWeek);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Month") {
      setPaymentMethod(ctx.paymentRevenueThisMonth);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === "This Year") {
      setPaymentMethod(ctx.paymentRevenueThisYear);
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

  useEffect(() => {
    ctx.getPaymentRevenueToday();
    ctx.getPaymentRevenueThisWeek();
    ctx.getPaymentRevenueThisMonth();
    ctx.getPaymentRevenueThisYear();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Payment Overview"
          links={[]}
          action={
            <>
              <Select
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
                sx={{
                  height: "40px",
                  mt: 2,
                }}
              >
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="This Year">This Year</MenuItem>
                <MenuItem value="By Date">By Date</MenuItem>
              </Select>
            </>
          }
        />

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

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <YearlyWidgetSummary
                  title={paymentMethod?.label?.[0] || "Card"}
                  subtitle={`${period || filterLabel}`}
                  total={paymentMethod?.value?.[0] || 0}
                  type="currency"
                  color="warning"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <YearlyWidgetSummary
                  title={paymentMethod?.label?.[1] || "Cash"}
                  subtitle={`${period || filterLabel}`}
                  total={paymentMethod?.value?.[1] || 0}
                  type="currency"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <YearlyWidgetSummary
                  title={paymentMethod?.label?.[2] || "E-Wallet"}
                  subtitle={`${period || filterLabel}`}
                  total={paymentMethod?.value?.[2] || 0}
                  type="currency"
                  color="success"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <YearlyWidgetSummary
                  title="Total"
                  subtitle={`${period || filterLabel}`}
                  total={paymentMethod?.value?.[0] + paymentMethod?.value?.[1] + paymentMethod?.value?.[2] || 0}
                  type="currency"
                  color="info"
                  icon={"heroicons-solid:currency-dollar"}
                />
              </Grid>
            </Grid>
          </Grid>

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
                    label: paymentMethod?.label?.[0] || "Card",
                    value: paymentMethod?.value?.[0] || 0
                  },
                  {
                    label: paymentMethod?.label?.[1] || "Cash",
                    value: paymentMethod?.value?.[1] || 0
                  },
                  {
                    label: paymentMethod?.label?.[2] || "E-Wallet",
                    value: paymentMethod?.value?.[2] || 0
                  },
                  {
                    label: paymentMethod?.label?.[3] || "Bank Transfer",
                    value: paymentMethod?.value?.[3] || 0
                  },
                  {
                    label: paymentMethod?.label?.[4] || "Online Payment",
                    value: paymentMethod?.value?.[4] || 0
                  },
                  {
                    label: paymentMethod?.label?.[5] || "QRIS",
                    value: paymentMethod?.value?.[5] || 0
                  },
                ]}
                chartColors={[
                  theme.palette.warning.main,
                  theme.palette.primary.main,
                  theme.palette.chart.green[0],
                  // theme.palette.chart.violet[0],
                ]}
              />
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
