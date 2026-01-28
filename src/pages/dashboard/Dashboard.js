import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
// @mui
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import { YearlyWidgetSummary, SalesOverview, BestSeller, TableComponent } from '../../sections/@dashboard/app';
import AlertNewUser from './modalinformation';

// ----------------------------------------------------------------------

export default function Dashboard() {
  const { themeStretch } = useSettings();

  const [filterRevenue, setFilterRevenue] = useState(null);
  const [typeOfTime, setTypeOfTime] = useState(0);
  const [filterLabel, setFilterLabel] = useState('thisMonth');
  const [loadingRev, setLoadingRev] = useState(false);
  const [startRev, setStartRev] = useState(null);
  const [endRev, setEndRev] = useState(null);
  const [revDate, setRevDate] = useState({});
  const [expenseDate, setExpenseDate] = useState({});

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch data menggunakan useQuery
  const fetchData = async (endpoint, isArray = false) => {
    const { data } = await axios.get(endpoint);
    return isArray ? data : data[0];
  };

  // Gunakan useQuery untuk setiap endpoint
  const queryOptions = {
    // refetchOnWindowFocus: false, // Panggil ulang saat fokus ke halaman
    // refetchOnMount: false, // Panggil ulang saat komponen dimuat ulang
    cacheTime: 0, // Jangan simpan data dalam cache
    staleTime: 0, // Data selalu dianggap usang, sehingga akan selalu di-fetch ulang
  };

  const { data: today } = useQuery('revenueToday', () => fetchData('/revenue/today'), queryOptions);
  const { data: thisWeek } = useQuery('revenueThisWeek', () => fetchData('/revenue/this-week'), queryOptions);
  const { data: thisMonth } = useQuery('revenueThisMonth', () => fetchData('/revenue/this-month'), queryOptions);
  const { data: thisYear } = useQuery('revenueThisYear', () => fetchData('/revenue/this-year'), queryOptions);
  const { data: expenseToday } = useQuery(
    'expenseToday',
    () => fetchData('/expense/total?filter=today', true),
    queryOptions
  );
  const { data: expenseThisWeek } = useQuery(
    'expenseThisWeek',
    () => fetchData('/expense/total?filter=thisWeek', true),
    queryOptions
  );
  const { data: expenseThisMonth } = useQuery(
    'expenseThisMonth',
    () => fetchData('/expense/total?filter=thisMonth', true),
    queryOptions
  );
  const { data: expenseThisYear } = useQuery(
    'expenseThisYear',
    () => fetchData('/expense/total?filter=thisYear', true),
    queryOptions
  );
  const { data: salesThisWeek, isLoading: loadingChart } = useQuery(
    'salesThisWeek',
    () => fetchData('/sales/this-week', true),
    queryOptions
  );
  const { data: salesThisMonth } = useQuery('salesThisMonth', () => fetchData('/sales/this-month', true), queryOptions);
  const { data: salesMonthly } = useQuery('salesMonthly', () => fetchData('/sales/monthly', true), queryOptions);
  const { data: paymentRevenueToday } = useQuery(
    'paymentRevenueToday',
    () => fetchData('/revenue-overview/today'),
    queryOptions
  );
  const { data: paymentRevenueThisWeek } = useQuery(
    'paymentRevenueThisWeek',
    () => fetchData('/revenue-overview/this-week'),
    queryOptions
  );
  const { data: paymentRevenueThisMonth, isLoading: loadingPayment } = useQuery(
    'paymentRevenueThisMonth',
    () => fetchData('/revenue-overview/this-month'),
    queryOptions
  );
  const { data: paymentRevenueThisYear } = useQuery(
    'paymentRevenueThisYear',
    () => fetchData('/revenue-overview/this-year'),
    queryOptions
  );
  const { data: popularProduct, isLoading: loadingPopularProduct } = useQuery({
    queryKey: ['popular', filterLabel, startDate, endDate],
    queryFn: () =>
      axios.get(`/popular?filter=${filterLabel}&start=${startDate}&end=${endDate}`).then((res) => res.data),
    ...queryOptions,
  });

  useEffect(() => {
    setShowFilterDate(filterLabel === 'By Date');

    if (filterLabel !== 'By Date') {
      const mappingPayment = {
        Today: paymentRevenueToday,
        'This Week': paymentRevenueThisWeek,
        'This Month': paymentRevenueThisMonth,
        'This Year': paymentRevenueThisYear,
      };

      setPaymentMethod(mappingPayment[filterLabel]);
      handleReset();
    }
  }, [filterLabel, paymentRevenueThisMonth]);

  useEffect(() => {
    if (typeOfTime === 0) {
      setFilterRevenue('Today');
    } else if (typeOfTime === 1) {
      setFilterRevenue('This Week');
    } else if (typeOfTime === 2) {
      setFilterRevenue('This Month');
    } else if (typeOfTime === 3) {
      setFilterRevenue('This Year');
    } else {
      setFilterRevenue('By Date');
    }
  }, [typeOfTime]);

  const getDataByTime = (type = '') => {
    if (type === 'expense') {
      return [expenseToday, expenseThisWeek, expenseThisMonth, expenseThisYear, expenseDate][typeOfTime] || {};
    }
    return [today, thisWeek, thisMonth, thisYear, revDate][typeOfTime] || {};
  };

  // const getReport = (type) => getDataByTime()?.detail?.find((item) => item?.type?.toLowerCase() === type?.toLowerCase()) || {};

  // const getTotalSales = () => getDataByTime()?.totalSales || 0;
  const getTotalRevenue = () => getDataByTime()?.totalRevenue || 0;
  const getTotalDonation = () => getDataByTime()?.totalDonation || 0;
  const getTotalExpense = () => getDataByTime('expense')?.totalExpense || 0;

  const handleSearchRev = async () => {
    if (!startRev || !endRev) return;
    setLoadingRev(true);

    try {
      const [revResponse, expenseResponse] = await Promise.all([
        axios.get(`/revenue/date?start=${startRev}&end=${endRev}`),
        axios.get(`/expense/total?start=${startRev}&end=${endRev}`),
      ]);
      setRevDate(revResponse.data[0]);
      setExpenseDate(expenseResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setRevDate({});
      setExpenseDate({});
    } finally {
      setLoadingRev(false);
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    try {
      const [popularResponse, revenueResponse] = await Promise.all([
        axios.get(`/popular/date?start=${startDate}&end=${endDate}`),
        axios.get(`/revenue-overview/date?start=${startDate}&end=${endDate}`),
      ]);

      setPeriod(`(${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')})`);
      // setPopular(popularResponse.data[0]);
      setPaymentMethod(revenueResponse.data[0]);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // setPopular([]);
      setPaymentMethod([]);
    }
  };

  const handleReset = () => {
    setPeriod('');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">DASHBOARD</Typography>
          </Box>
          <Select
            value={typeOfTime}
            onChange={(e) => setTypeOfTime(e.target.value)}
            sx={{
              height: '40px',
            }}
          >
            <MenuItem value={0}>Today</MenuItem>
            <MenuItem value={1}>This Week</MenuItem>
            <MenuItem value={2}>This Month</MenuItem>
            <MenuItem value={3}>This Year</MenuItem>
            <MenuItem value={4}>By Date</MenuItem>
          </Select>
        </Box>

        {typeOfTime === 4 && (
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
              <Grid item xs={12} sm="auto">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="Start Date"
                    inputFormat="dd/MM/yyyy"
                    value={startRev}
                    onChange={(newValue) => {
                      setStartRev(newValue);
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
                    value={endRev}
                    onChange={(newValue) => {
                      setEndRev(newValue);
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
                <LoadingButton
                  variant="contained"
                  title="Search"
                  disabled={startRev && endRev ? Boolean(false) : Boolean(true)}
                  loading={loadingRev}
                  onClick={() => handleSearchRev()}
                >
                  <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <YearlyWidgetSummary
              title="Revenue"
              subtitle={filterRevenue}
              // total={getReport("onsite")?.revenue || 0}
              total={getTotalRevenue()}
              // sales={getReport("onsite")?.sales || 0}
              type="currency"
              icon={'heroicons-solid:currency-dollar'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <YearlyWidgetSummary
              title="Donation"
              subtitle={filterRevenue}
              total={getTotalDonation()}
              type="currency"
              color="success"
              icon={'heroicons-solid:currency-dollar'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <YearlyWidgetSummary
              title="Expense"
              subtitle={filterRevenue}
              total={getTotalExpense()}
              // sales={getTotalSales()}
              color="warning"
              type="currency"
              // icon={"icon-park-solid:sales-report"}
              icon={'heroicons-solid:currency-dollar'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <YearlyWidgetSummary
              title="Profit"
              subtitle={filterRevenue}
              total={getTotalRevenue() + getTotalDonation() - getTotalExpense()}
              // sales={getTotalSales()}
              type="currency"
              color="info"
              icon={'heroicons-solid:currency-dollar'}
            />
          </Grid>

          <Grid item xs={12}>
            {loadingChart ? (
              <Stack height={364} justifyContent="center" alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <SalesOverview
                title="Daily Sales"
                chartData={[
                  ...(salesThisWeek || []),
                  ...(salesThisMonth || []),
                  ...(salesMonthly || []),
                  ...[
                    {
                      sales: [
                        {
                          name: 'Onsite',
                          data: [],
                        },
                        {
                          name: 'Delivery',
                          data: [],
                        },
                      ],
                      filter: 'Date',
                      label: [],
                    },
                  ],
                ]}
              />
            )}
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Select
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              sx={{
                height: '40px',
                mt: 2,
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="By Date">By Date</MenuItem>
            </Select>
          </Grid>

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
                    <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={6}>
            {loadingPayment ? (
              <Stack height={364} justifyContent="center" alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <BestSeller
                title="Payment Method"
                subheader={`${filterLabel} ${period}`}
                data={[
                  {
                    label: paymentMethod?.label?.[1] || '',
                    total: paymentMethod?.value?.[1] || 0,
                    percent: ((paymentMethod?.value?.[1] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: paymentMethod?.label?.[5] || '',
                    total: paymentMethod?.value?.[5] || 0,
                    percent: ((paymentMethod?.value?.[5] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: paymentMethod?.label?.[3] || '',
                    total: paymentMethod?.value?.[3] || 0,
                    percent: ((paymentMethod?.value?.[3] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: paymentMethod?.label?.[0] || '',
                    total: paymentMethod?.value?.[0] || 0,
                    percent: ((paymentMethod?.value?.[0] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: paymentMethod?.label?.[2] || '',
                    total: paymentMethod?.value?.[2] || 0,
                    percent: ((paymentMethod?.value?.[2] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: paymentMethod?.label?.[4] || '',
                    total: paymentMethod?.value?.[4] || 0,
                    percent: ((paymentMethod?.value?.[4] || 0) / (paymentMethod?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                ]}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            {loadingPopularProduct ? (
              <Stack height={364} justifyContent="center" alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <BestSeller
                title="Popular Product"
                subheader={`${filterLabel} ${period}`}
                data={[
                  {
                    label: popularProduct?.detail?.[0]?.product || '',
                    total: popularProduct?.detail?.[0]?.sales || 0,
                    percent: ((popularProduct?.detail?.[0]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  {
                    label: popularProduct?.detail?.[1]?.product || '',
                    total: popularProduct?.detail?.[1]?.sales || 0,
                    percent: ((popularProduct?.detail?.[1]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  {
                    label: popularProduct?.detail?.[2]?.product || '',
                    total: popularProduct?.detail?.[2]?.sales || 0,
                    percent: ((popularProduct?.detail?.[2]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  {
                    label: popularProduct?.detail?.[3]?.product || '',
                    total: popularProduct?.detail?.[3]?.sales || 0,
                    percent: ((popularProduct?.detail?.[3]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  {
                    label: popularProduct?.detail?.[4]?.product || '',
                    total: popularProduct?.detail?.[4]?.sales || 0,
                    percent: ((popularProduct?.detail?.[4]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  {
                    label: popularProduct?.detail?.[5]?.product || '',
                    total: popularProduct?.detail?.[5]?.sales || 0,
                    percent: ((popularProduct?.detail?.[5]?.sales || 0) / (popularProduct?.totalSales || 0)) * 100 || 0,
                  },
                  // {
                  //   label: popular?.detail?.[6]?.product || "",
                  //   total: popular?.detail?.[6]?.sales || 0,
                  //   percent:
                  //     ((popular?.detail?.[6]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                  // },
                  // {
                  //   label: popular?.detail?.[7]?.product || "",
                  //   total: popular?.detail?.[7]?.sales || 0,
                  //   percent:
                  //     ((popular?.detail?.[7]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                  // },
                  // {
                  //   label: popular?.detail?.[8]?.product || "",
                  //   total: popular?.detail?.[8]?.sales || 0,
                  //   percent:
                  //     ((popular?.detail?.[8]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                  // },
                  // {
                  //   label: popular?.detail?.[9]?.product || "",
                  //   total: popular?.detail?.[9]?.sales || 0,
                  //   percent:
                  //     ((popular?.detail?.[9]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                  // },
                ]}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <TableComponent />
          </Grid>
        </Grid>
      </Container>
      <AlertNewUser />
    </Page>
  );
}
