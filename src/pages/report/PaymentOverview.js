import React, { useEffect, useState } from 'react';
// @mui
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Stack,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import { useQuery } from 'react-query';
// utils
import axios from '../../utils/axios';
import { numberWithCommas } from '../../utils/getData';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import { WidgetSummary, RevenueOverview } from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------

const queryOptions = {
  cacheTime: 0,
  staleTime: 0,
};

export default function PaymentOverview() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [filterLabel, setFilterLabel] = useState('today');
  const [showFilterDate, setShowFilterDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const options = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
    // { label: "By Date", value: "date" },
  ];

  // Format date untuk API
  const formatDateForAPI = (date) => {
    return date ? moment(date).format('YYYY-MM-DD') : null;
  };

  // Fetch revenue data menggunakan React Query
  const { data: revenueData, isLoading } = useQuery({
    queryKey:
      filterLabel === 'date'
        ? ['revenueOverview', filterLabel, formatDateForAPI(startDate), formatDateForAPI(endDate)]
        : ['revenueOverview', filterLabel],
    queryFn: () => {
      let url = `/payment-revenue?filter=${filterLabel}`;

      // Only add start and end params for date filter
      if (filterLabel === 'date' && startDate && endDate) {
        url += `&start=${formatDateForAPI(startDate)}&end=${formatDateForAPI(endDate)}`;
      }

      return axios.get(url).then((res) => res.data);
    },
    ...queryOptions,
    enabled: filterLabel !== 'date' || (startDate !== null && endDate !== null),
  });

  // Handle array or object response
  const paymentMethod = revenueData ? (Array.isArray(revenueData) ? revenueData[0] : revenueData) : null;

  // Get period text
  const getPeriodText = () => {
    if (filterLabel === 'date' && paymentMethod?.period) {
      return `(${moment(paymentMethod.period.start).format('DD MMMM YYYY')} - ${moment(paymentMethod.period.end).format(
        'DD MMMM YYYY'
      )})`;
    }
    if (filterLabel === 'date' && startDate && endDate) {
      return `(${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')})`;
    }
    return '';
  };

  // Get filter label text
  const getFilterLabelText = () => {
    const option = options.find((opt) => opt.value === filterLabel);
    return option ? option.label : '';
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilterLabel(value);

    if (value === 'date') {
      setShowFilterDate(true);
    } else {
      setShowFilterDate(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Safe value getter with fallback
  const getValue = (index) => {
    return paymentMethod?.value?.[index] || 0;
  };

  const getLabel = (index, fallback) => {
    return paymentMethod?.label?.[index] || fallback;
  };

  // Calculate total
  const getTotal = () => {
    if (!paymentMethod?.value) return 0;
    return paymentMethod.value.reduce((sum, val) => sum + (val || 0), 0);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
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
                color: filterLabel === item.value ? theme.palette.primary.main : theme.palette.grey[400],
                bgcolor: filterLabel === item.value ? theme.palette.primary.lighter : '',
              }}
              size="large"
              onClick={() => handleFilterChange(item.value)}
            >
              {item.label}
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
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
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
                      minDate={startDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
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
                  <Button
                    variant="contained"
                    title="Search"
                    disabled={!startDate || !endDate}
                    onClick={() => setFilterLabel('date')}
                  >
                    <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          {isLoading ? (
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={6} lg={6}>
                <Card>
                  <RevenueOverview
                    sx={{
                      padding: '0.5vw',
                    }}
                    title="Payment Method Overview"
                    subheader={`${getFilterLabelText()} ${getPeriodText()}`}
                    chartData={[
                      {
                        label: getLabel(1, 'Cash'),
                        value: getValue(1),
                      },
                      {
                        label: getLabel(5, 'QRIS'),
                        value: getValue(5),
                      },
                      {
                        label: getLabel(3, 'Bank Transfer'),
                        value: getValue(3),
                      },
                      {
                        label: getLabel(0, 'Card'),
                        value: getValue(0),
                      },
                      {
                        label: getLabel(2, 'E-Wallet'),
                        value: getValue(2),
                      },
                      {
                        label: getLabel(4, 'Online Payment'),
                        value: getValue(4),
                      },
                    ]}
                    chartColors={[theme.palette.primary.main, theme.palette.primary.light, theme.palette.primary.dark]}
                    chartType="donut"
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(1, 'Cash')}
                      total={getValue(1)}
                      type="currency"
                      color="warning"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(5, 'QRIS')}
                      total={getValue(5)}
                      type="currency"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(3, 'Bank Transfer')}
                      total={getValue(3)}
                      type="currency"
                      color="success"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(0, 'Card')}
                      total={getValue(0)}
                      type="currency"
                      color="success"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(2, 'E-Wallet')}
                      total={getValue(2)}
                      type="currency"
                      color="success"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WidgetSummary
                      title={getLabel(4, 'Online Payment')}
                      total={getValue(4)}
                      type="currency"
                      color="success"
                      icon={'heroicons-solid:currency-dollar'}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  bgcolor={theme.palette.primary.lighter}
                  borderRadius={1}
                  p={2}
                  gap={3}
                >
                  <Typography variant="h6" color="#637381">
                    Total
                  </Typography>
                  <Typography variant="h6" color="#637381">
                    Rp. {numberWithCommas(getTotal())}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
