import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
// @mui
import {
  Card,
  CardHeader,
  Box,
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

SalesOverview.propTypes = {
  title: PropTypes.string,
};

const queryOptions = {
  cacheTime: 0,
  staleTime: 0,
};

export default function SalesOverview({ title, ...other }) {
  const [filterLabel, setFilterLabel] = useState('today');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilterDate, setShowFilterDate] = useState(false);
  const [subheader, setSubheader] = useState('');

  // Helper functions
  const getFirstDateInWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const getLastDateInWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const first = date.getDate() - day;
    const last = first + 6;
    return new Date(date.setDate(last));
  };

  const getFirstDateInMonth = (year, month) => {
    return new Date(year, month, 1);
  };

  const getLastDateInMonth = (year, month) => {
    return new Date(year, month + 1, 0);
  };

  // Format date untuk API
  const formatDateForAPI = (date) => {
    return date ? moment(date).format('YYYY-MM-DD') : null;
  };

  const { data: salesReport, isLoading: loadingSalesReport } = useQuery({
    queryKey:
      filterLabel === 'date'
        ? ['salesReport', filterLabel, formatDateForAPI(startDate), formatDateForAPI(endDate)]
        : ['salesReport', filterLabel],
    queryFn: () => {
      let url = `/sales-overview?filter=${filterLabel}`;

      // Only add start and end params for date filter
      if (filterLabel === 'date' && startDate && endDate) {
        url += `&start=${formatDateForAPI(startDate)}&end=${formatDateForAPI(endDate)}`;
      }

      return axios.get(url).then((res) => res.data);
    },
    ...queryOptions,
    enabled: filterLabel !== 'date' || (startDate !== null && endDate !== null),
  });

  // Update subheader based on filter
  useEffect(() => {
    const today = new Date();

    // Handle if response is array
    const data = Array.isArray(salesReport) ? salesReport[0] : salesReport;

    // If we have salesReport with period, use that for date filter
    if (filterLabel === 'date' && data?.period) {
      setSubheader(
        `${moment(data.period.start).format('DD MMMM YYYY')} - ${moment(data.period.end).format('DD MMMM YYYY')}`
      );
      return;
    }

    switch (filterLabel) {
      case 'today': {
        setSubheader(moment(today).format('DD MMMM YYYY'));
        break;
      }
      case 'thisWeek': {
        const firstDay = getFirstDateInWeek(today);
        const lastDay = getLastDateInWeek(today);
        setSubheader(`${moment(firstDay).format('DD MMMM YYYY')} - ${moment(lastDay).format('DD MMMM YYYY')}`);
        break;
      }
      case 'thisMonth': {
        const firstDay = getFirstDateInMonth(today.getFullYear(), today.getMonth());
        const lastDay = getLastDateInMonth(today.getFullYear(), today.getMonth());
        setSubheader(`${moment(firstDay).format('DD MMMM YYYY')} - ${moment(lastDay).format('DD MMMM YYYY')}`);
        break;
      }
      case 'monthly': {
        setSubheader(`January - December ${today.getFullYear()}`);
        break;
      }
      case 'date': {
        if (startDate && endDate) {
          setSubheader(`${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')}`);
        } else {
          setSubheader('Please select date range');
        }
        break;
      }
      default:
        setSubheader('');
    }
  }, [filterLabel, startDate, endDate, salesReport]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { value } = e.target;
    setFilterLabel(value);

    if (value === 'date') {
      setShowFilterDate(true);
    } else {
      setShowFilterDate(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Get labels based on sales data
  const getChartLabels = () => {
    if (!salesReport) return [];
    // Handle if response is array
    const data = Array.isArray(salesReport) ? salesReport[0] : salesReport;
    return data?.label || [];
  };

  // Get series data
  const getChartSeries = () => {
    if (!salesReport) return [];
    // Handle if response is array
    const data = Array.isArray(salesReport) ? salesReport[0] : salesReport;
    return data?.sales || [];
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: getChartLabels(),
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: false,
      },
    },
    yaxis: {
      min: 0,
      max: undefined,
      tickAmount: 5,
      forceNiceScale: false,
      labels: {
        show: true,
        formatter(val) {
          return Math.floor(val);
        },
      },
    },
    chart: {
      toolbar: {
        show: true,
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Select
            value={filterLabel}
            onChange={handleFilterChange}
            sx={{
              height: '40px',
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="monthly">This Year</MenuItem>
            <MenuItem value="date">By Date</MenuItem>
          </Select>
        }
      />

      {showFilterDate && (
        <Box sx={{ mt: 2, px: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Start Date"
                  inputFormat="dd/MM/yyyy"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <img src="/assets/calender-icon.svg" alt="calendar" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="End Date"
                  inputFormat="dd/MM/yyyy"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <img src="/assets/calender-icon.svg" alt="calendar" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        {loadingSalesReport ? (
          <Box sx={{ height: 364, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReactApexChart
            type="line"
            series={getChartSeries().length > 0 ? getChartSeries() : [{ name: 'No Data', data: [] }]}
            options={chartOptions}
            height={364}
          />
        )}
      </Box>
    </Card>
  );
}
