import PropTypes from "prop-types";
import merge from "lodash/merge";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
// @mui
import { Card, CardHeader, Box, Select, MenuItem, Grid, Button, TextField, InputAdornment } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import axios from "../../../utils/axios";
// components
import { BaseOptionChart } from "../../../components/chart";
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

SalesOverview.propTypes = {
  title: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function SalesOverview({ title, chartData, ...other }) {
  // const [seriesData, setSeriesData] = useState(chartData[0]?.filter);
  // const [label, setLabel] = useState(chartData[0]?.label);
  const [seriesData, setSeriesData] = useState("This Week");
  const [label, setLabel] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [subheader, setSubheader] = useState(null);

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function getFirstDateInWeek(d) {
    d = new Date(d);
    const day = d.getDay();
    // const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getLastDateInWeek(d) {
    d = new Date(d);
    const day = d.getDay();
    // const first = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const first = d.getDate() - day;
    const last = first + 6;
    return new Date(d.setDate(last));
  }

  function getFirstDateInMonth(year, month) {
    return new Date(year, month, 1);
  }

  function getLastDateInMonth(year, month) {
    return new Date(year, month + 1, 0);
  }

  // get the first date of the current month
  const date = new Date();
  const firstDay = getFirstDateInMonth(date.getFullYear(), date.getMonth());
  const lastDay = getLastDateInMonth(date.getFullYear(), date.getMonth());

  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value);

    // if (event.target.value === "Daily") {
    //   setLabel(chartData[0]?.label);
    //   setSubheader(`${moment(new Date()).format("DD MMMM YYYY")}`);
    // }
    if (event.target.value === "Date") {
      setLabel(chartData[3]?.label);
      if (startDate && endDate) {
        setSubheader(`${moment(startDate).format("DD MMMM YYYY")} - ${moment(endDate).format("DD MMMM YYYY")}`);
      }
      setShowFilterDate(true);
    } else if (event.target.value === "This Week") {
      setLabel(chartData[0]?.label);
      setSubheader(
        `${moment(getFirstDateInWeek(new Date())).format("DD MMMM YYYY")} - ${moment(
          getLastDateInWeek(new Date())
        ).format("DD MMMM YYYY")}`
      );
      setShowFilterDate(false);
    } else if (event.target.value === "This Month") {
      setLabel(chartData[1]?.label);
      setSubheader(`${moment(firstDay).format("DD MMMM YYYY")} - ${moment(lastDay).format("DD MMMM YYYY")}`);
      setShowFilterDate(false);
    } else {
      setLabel(chartData[2]?.label);
      setSubheader(`January - December (${new Date().getFullYear()})`);
      setShowFilterDate(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (startDate && endDate) {
        const sales = await axios.get(`/report/sales/date?start=${startDate}&end=${endDate}`);

        chartData[3] = sales.data[0];
        setSubheader(`${moment(startDate).format("DD MMMM YYYY")} - ${moment(endDate).format("DD MMMM YYYY")}`);
        setLabel(sales.data[0].label);
      }
    } catch (error) {
      console.log(error);
      setLabel([]);
    }
  };

  useEffect(() => {
    setSubheader(
      `${moment(getFirstDateInWeek(new Date())).format("DD MMMM YYYY")} - ${moment(
        getLastDateInWeek(new Date())
      ).format("DD MMMM YYYY")}`
    );
  }, []);

  const handleTypeOption = (filter) => {
    if (filter === "This Week") {
      return "This Week";
    }
    if (filter === "This Month") {
      return "This Month";
    }
    if (filter === "Monthly") {
      return "This Year";
    }
    if (filter === "Date") {
      return "By Date";
    }
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: label,
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Select
            value={seriesData}
            onChange={(e) => handleChangeSeriesData(e)}
            sx={{
              height: "40px",
            }}
          >
            {chartData?.map((option, index) => (
              <MenuItem value={option.filter} key={index}>
                {handleTypeOption(option.filter)}
              </MenuItem>
            ))}
          </Select>
        }
      />

      {showFilterDate && (
        <Grid item xs={12} mt={1}>
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

      {chartData?.map((item, i) => (
        <Box key={i} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.filter === seriesData && (
            <ReactApexChart type="line" series={item.sales} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
