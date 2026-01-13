import React, { useState } from "react";
import { useQuery } from "react-query";
// @mui
import {
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
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
// sections
import { BestSeller } from "../../sections/@dashboard/app";

// ----------------------------------------------------------------------

export default function PopularProduct() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [filterLabel, setFilterLabel] = useState("This Month");

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const options = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
    // { label: "By Date", value: "by-date" },
  ];
  const defaultPeriod = "this-month";
  const [controller, setController] = useState({
    periodBy: defaultPeriod,
    start: "",
    end: ""
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/report/v2/popular?${queryString}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, data } = useQuery(
    [
      "listPopular",
      {
        periodBy: controller.periodBy,
        start: controller.start,
        end: controller.end,
      },
    ],
    getData
  );

  const handleReset = () => {
    setPeriod("");
    setStartDate(null);
    setEndDate(null);
    setController({
      periodBy: defaultPeriod,
      start: "",
      end: ""
    });
  };

  const handleFilter = (val) => {
    setFilterLabel(val?.label);
    if (val?.value !== "by-date") {
      setController({ ...controller, periodBy: val?.value });
      setShowFilterDate(false);
      setPeriod("");
    } else {
      setShowFilterDate(true);
    }
  }

  const handleSearch = async () => {
    setController({ ...controller, periodBy: "", start: startDate, end: endDate });
    setPeriod(`(${moment(startDate).format("DD MMMM YYYY")} - ${moment(endDate).format("DD MMMM YYYY")})`);
  };

  return (
    <Page title="Popular Product">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h6" mx={1}>
          Popular Product
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
                color: filterLabel === item?.label ? theme.palette.primary.main : theme.palette.grey[400],
                bgcolor: filterLabel === item?.label ? theme.palette.primary.lighter : "",
              }}
              size="large"
              onClick={() => handleFilter(item)}
            >
              {item?.label}
            </Button>
          ))}
        </Stack>

        <Grid container spacing={4}>
          {showFilterDate && (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
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
                  <Button variant="contained" color="warning" sx={{ color: "white", mr: 1 }} title="Reset" onClick={() => handleReset()}>
                    <Iconify icon={"mdi:reload"} sx={{ width: 25, height: 25 }} />
                  </Button>
                  <LoadingButton
                    variant="contained"
                    title="Search"
                    disabled={startDate && endDate ? Boolean(false) : Boolean(true)}
                    loading={isLoading}
                    onClick={() => handleSearch()}
                  >
                    <Iconify icon={"eva:search-fill"} sx={{ width: 25, height: 25 }} />
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={6}>
            <BestSeller
              sx={{
                padding: "1vw",
                boxShadow: "0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)"
              }}
              title="Top 10 Produk Satuan"
              subheader={`${filterLabel} ${period}`}
              data={[
                {
                  label: data?.[0]?.satuan?.detail?.[0]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[0]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[0]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[1]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[1]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[1]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[2]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[2]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[2]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[3]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[3]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[3]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[4]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[4]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[4]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[5]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[5]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[5]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[6]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[6]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[6]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[7]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[7]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[7]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[8]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[8]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[8]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.satuan?.detail?.[9]?.product || "",
                  total: data?.[0]?.satuan?.detail?.[9]?.sales || 0,
                  percent:
                    ((data?.[0]?.satuan?.detail?.[9]?.sales || 0) / (data?.[0]?.satuan?.totalSales || 0)) * 100 || 0,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <BestSeller
              sx={{
                padding: "1vw",
                boxShadow: "0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)"
              }}
              title="Top 10 Produk Kiloan"
              subheader={`${filterLabel} ${period}`}
              data={[
                {
                  label: data?.[0]?.kiloan?.detail?.[0]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[0]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[0]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[1]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[1]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[1]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[2]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[2]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[2]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[3]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[3]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[3]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[4]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[4]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[4]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[5]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[5]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[5]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[6]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[6]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[6]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[7]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[7]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[7]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[8]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[8]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[8]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: data?.[0]?.kiloan?.detail?.[9]?.product || "",
                  total: data?.[0]?.kiloan?.detail?.[9]?.sales || 0,
                  percent:
                    ((data?.[0]?.kiloan?.detail?.[9]?.sales || 0) / (data?.[0]?.kiloan?.totalSales || 0)) * 100 || 0,
                },
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
