import React, { useState } from "react";
import { useQuery } from "react-query";
// @mui
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  TextField,
  Stack,
  Typography,
  InputAdornment,
  MenuItem,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Label from "../../../components/Label";
// utils
import axios from "../../../utils/axios";
import { formatDate2 } from "../../../utils/getData";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
// sections
import { BestActivity, WidgetPerformance } from "../../../sections/@dashboard/app";
import defaultAvatar from "../../../assets/avatar_default.jpg";
import ListActivity from "./ListActivity";

// ----------------------------------------------------------------------


export default function StaffPerformance() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const initialData = Array(6).fill({
    label: "",
    total: 0,
    percent: 0
  });
  const options = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
    // { value: "by-date", label: "By Date" }
  ];
  const defaultPeriod = "this-month";
  const [showFilterDate, setShowFilterDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ctrStaff, setCtrStaff] = useState({
    page: 1,
    perPage: 50,
    search: ""
  });
  const [controller, setController] = useState({
    search: "",
    staff: "all",
    periodBy: defaultPeriod,
    start: "",
    end: ""
  });


  // const handleReset = () => {
  //   setStartDate(null);
  //   setEndDate(null);
  //   setController({
  //     search: "",
  //     staff: "all",
  //     periodBy: defaultPeriod,
  //     start: "",
  //     end: ""
  //   });
  // };

  const getStaff = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/users?${queryString}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };
  const { isLoading: loadingStaff, data: staffData } = useQuery(
    [
      "listStaff",
      {
        page: ctrStaff.page,
        perPage: ctrStaff.perPage,
        search: ctrStaff.search,
        role: "Content Writer:ne"
      },
    ],
    getStaff
  );

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/progress/log-summary?${queryString}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading: loadingSummary, data: summaryData } = useQuery(
    [
      "summaryActivity",
      {
        search: controller.search,
        staff: controller.staff,
        periodBy: controller.periodBy,
        start: controller.start,
        end: controller.end,
      },
    ],
    getData
  );

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h6" mx={1}>
          Staff Performance
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="h6" mx={1} mb={2}>
            Summary
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mb={1}
          >
            <TextField
              name="staff"
              label="Staff"
              placeholder="Staff"
              select
              sx={{ minWidth: 200 }}
              value={controller?.staff || "all"}
              onChange={(e) => {
                setController({
                  ...controller,
                  staff: e.target.value
                });

              }}
            >
              <MenuItem value="all">
                All
              </MenuItem>
              {staffData?.docs?.map((item, i) => (
                <MenuItem key={i} value={item?._id}>
                  {item?.fullname}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Period"
              name="period"
              select
              sx={{ minWidth: 200 }}
              value={controller?.periodBy || defaultPeriod}
              onChange={(e) => {
                setController({
                  ...controller,
                  periodBy: e.target.value
                });
              }}
            >
              {options.map((item, i) => (
                <MenuItem key={i} value={item?.value}>{item?.label}</MenuItem>
              ))}
            </TextField>
            {showFilterDate && (
              <>
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
              </>
            )}
          </Stack>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5} lg={6}>
              <BestActivity
                // sx={{
                //   padding: "1vw",
                //   boxShadow: "0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)"
                // }}
                title="Activity"
                // subheader={`${options[controller?.periodBy]}`}
                subheader={options.find(opt => opt.value === controller?.periodBy)?.label || ""}
                data={
                  (summaryData?.detail?.length > 0 ? summaryData?.detail : initialData)?.map(item => {
                    const totalKg = summaryData?.totalKg || 0;
                    const totalPcs = summaryData?.totalPcs || 0;
                    const qtyKg = item?.qtyKg || 0;
                    const qtyPcs = item?.qtyPcs || 0;
                    return ({
                      label: item?.status,
                      // qtyOrder: item?.qty || 0,
                      qtyKg,
                      qtyPcs,
                      total: qtyKg + qtyPcs,
                      percent: ((qtyKg + qtyPcs) / ((totalKg + totalPcs) || 1)) * 100 || 0,
                    })
                  })}
              />
            </Grid>
            <Grid item xs={12} md={7} lg={6}>
              <Card sx={{ minHeight: 300, height: "100%" }}>
                <CardHeader title={controller.staff !== "all" ? "Staff Detail" : "Top Performance"} />
                <CardContent sx={{ pt: 2 }}>
                  <Stack gap={2}>
                    {controller.staff !== "all" ? (
                      <>
                        <Avatar
                          src={defaultAvatar}
                          alt="avatar"
                        />
                        <Stack gap={2}>
                          <Stack>
                            <Typography variant="body2">
                              Full Name
                            </Typography>
                            <Typography variant="subtitle2">
                              {summaryData?.staff?.fullname || "-"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">
                              Role
                            </Typography>
                            <Typography variant="subtitle2">
                              {summaryData?.staff?.role || "-"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">
                              Created At
                            </Typography>
                            <Typography variant="subtitle2">
                              {summaryData?.staff?.date ? formatDate2(summaryData?.staff?.date) : "-"}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">
                              Status
                            </Typography>
                            <div>
                              {summaryData?.staff ? (
                                <Label
                                  variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                                  color={summaryData?.staff?.isActive ? "success" : "warning"}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {summaryData?.staff?.isActive ? "Active" : "Inactive"}
                                </Label>
                              ) : "-"}
                            </div>
                          </Stack>
                        </Stack>
                      </>
                    ) : (
                      <Grid container spacing={2}>
                        {summaryData?.topPerformance?.map((item, i) => {
                          const detail = summaryData?.detail?.find(row => row?.status === item?.status);
                          const totalKg = detail?.qtyKg || 0;
                          const totalPcs = detail?.qtyPcs || 0;
                          const qtyKg = item?.qtyKg || 0;
                          const qtyPcs = item?.qtyPcs || 0;
                          return (
                            <Grid item xs={12} md={6} lg={6} key={i}>
                              <WidgetPerformance
                                title={item?.staff?.fullname || "-"}
                                subtitle={item?.status}
                                // qtyOrder={item?.qty || 0}
                                qtyKg={qtyKg}
                                qtyPcs={qtyPcs}
                                total={qtyKg + qtyPcs}
                                percent={((qtyKg + qtyPcs) / ((totalKg + totalPcs) || 1)) * 100 || 0}
                                color="warning"
                                icon="material-symbols:star-rounded"
                              />
                            </Grid>
                          )
                        })}
                      </Grid>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <ListActivity />
      </Container>
    </Page >
  );
}
