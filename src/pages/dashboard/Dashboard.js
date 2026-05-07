import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
// @mui
import {
  Box,
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { YearlyWidgetSummary, SalesOverview, BestSeller, TableComponent } from '../../sections/@dashboard/app';
import AlertNewUser from './modalinformation';
import { mainContext } from '../../contexts/MainContext';

// ----------------------------------------------------------------------

export default function Dashboard() {
  const ctm = useContext(mainContext);
  const { themeStretch } = useSettings();

  // State untuk filter bagian ATAS (Revenue, Donation, Sales)
  const [topFilterLabel, setTopFilterLabel] = useState('today');
  const [tempTopDate, setTempTopDate] = useState({ start: null, end: null });
  const [topStartDate, setTopStartDate] = useState(null);
  const [topEndDate, setTopEndDate] = useState(null);
  const [isTopCustomDateActive, setIsTopCustomDateActive] = useState(false);

  // State untuk filter bagian BAWAH (Payment Method, Popular Product)
  const [bottomFilterLabel, setBottomFilterLabel] = useState('thisMonth');
  const [tempBottomDate, setTempBottomDate] = useState({ start: null, end: null });
  const [bottomStartDate, setBottomStartDate] = useState(null);
  const [bottomEndDate, setBottomEndDate] = useState(null);
  const [isBottomCustomDateActive, setIsBottomCustomDateActive] = useState(false);

  // Gunakan useQuery untuk setiap endpoint
  const queryOptions = {
    cacheTime: 0, // Jangan simpan data dalam cache
    staleTime: 0, // Data selalu dianggap usang, sehingga akan selalu di-fetch ulang
  };

  // Tentukan parameter filter untuk bagian ATAS
  const getTopFilterParams = () => {
    if (isTopCustomDateActive && topStartDate && topEndDate) {
      return {
        filter: 'date',
        start: topStartDate,
        end: topEndDate,
      };
    }
    return {
      filter: topFilterLabel,
      start: null,
      end: null,
    };
  };

  // Tentukan parameter filter untuk bagian BAWAH
  const getBottomFilterParams = () => {
    if (isBottomCustomDateActive && bottomStartDate && bottomEndDate) {
      return {
        filter: 'date',
        start: bottomStartDate,
        end: bottomEndDate,
      };
    }
    return {
      filter: bottomFilterLabel,
      start: null,
      end: null,
    };
  };

  const topFilterParams = getTopFilterParams();
  const bottomFilterParams = getBottomFilterParams();

  const { data: dashboardRevenue, isLoading: loadingDashboardRevenue } = useQuery({
    queryKey: [
      'dashboard-revenue',
      ctm?.selectedOutlet,
      topFilterParams,
    ],

    queryFn: async () => {
      const { data } = await axios.get('/revenue', {
        params: {
          outletRef: ctm?.selectedOutlet,
          ...topFilterParams,
        },
      });

      return data;
    },
    enabled: !!ctm?.selectedOutlet,
    ...queryOptions,
  });

  const { data: popularProduct, isLoading: loadingPopularProduct } = useQuery({
    queryKey: [
      'popular',
      ctm?.selectedOutlet,
      bottomFilterParams,
    ],

    queryFn: async () => {
      const { data } = await axios.get('/popular', {
        params: {
          outletRef: ctm?.selectedOutlet,
          ...bottomFilterParams,
        },
      });

      return data;
    },
    enabled: !!ctm?.selectedOutlet,
    ...queryOptions,
  });

  const { data: mostPaymentUsed, isLoading: loadingMostPaymentUsed } = useQuery({
    queryKey: [
      'paymentmethod',
      ctm?.selectedOutlet,
      bottomFilterParams,
    ],

    queryFn: async () => {
      const { data } = await axios.get('/payment-revenue', {
        params: {
          outletRef: ctm?.selectedOutlet,
          ...bottomFilterParams,
        },
      });

      return data[0] || {};
    },
    enabled: !!ctm?.selectedOutlet,
    ...queryOptions,
  });

  const label = {
    thisMonth: 'This Month',
    thisWeek: 'This Week',
    today: 'Today',
    thisYear: 'This Year',
    date: 'Custom Date',
  };

  // Handler untuk preset filter ATAS
  const handleTopPresetFilterChange = (value) => {
    setTopFilterLabel(value);
    setIsTopCustomDateActive(false);
    setTempTopDate({ start: null, end: null });
    setTopStartDate(null);
    setTopEndDate(null);
  };

  // Handler untuk custom date filter ATAS
  const handleTopCustomDateToggle = () => {
    setIsTopCustomDateActive(true);
    setTopFilterLabel('date');
  };

  // Get current filter label untuk display ATAS
  const getTopCurrentFilterLabel = () => {
    if (isTopCustomDateActive && topStartDate && topEndDate) {
      return label.date;
    }
    return label[topFilterLabel];
  };

  // Handler untuk preset filter BAWAH
  const handleBottomPresetFilterChange = (value) => {
    setBottomFilterLabel(value);
    setIsBottomCustomDateActive(false);
    setTempBottomDate({ start: null, end: null });
    setBottomStartDate(null);
    setBottomEndDate(null);
  };

  // Handler untuk custom date filter BAWAH
  const handleBottomCustomDateToggle = () => {
    setIsBottomCustomDateActive(true);
    setBottomFilterLabel('date');
  };

  // Get current filter label untuk display BAWAH
  const getBottomCurrentFilterLabel = () => {
    if (isBottomCustomDateActive && bottomStartDate && bottomEndDate) {
      return label.date;
    }
    return label[bottomFilterLabel];
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">DASHBOARD</Typography>
          </Box>

          {/* Filter Preset ATAS */}
          <Select
            value={isTopCustomDateActive ? 'date' : topFilterLabel}
            onChange={(e) => {
              if (e.target.value === 'date') {
                handleTopCustomDateToggle();
              } else {
                handleTopPresetFilterChange(e.target.value);
              }
            }}
            sx={{
              height: '40px',
              mt: 2,
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
            <MenuItem value="date">Custom Date</MenuItem>
          </Select>
        </Box>

        {/* Custom Date Picker ATAS */}
        {isTopCustomDateActive && (
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Grid item xs={12} sm="auto">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Start Date"
                  inputFormat="dd/MM/yyyy"
                  value={tempTopDate?.start}
                  onChange={(newValue) => {
                    setTempTopDate((prev) => ({ ...prev, start: newValue }));
                  }}
                  onAccept={(newValue) => {
                    setTopStartDate(newValue);
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

            <Grid item xs={12} sm="auto">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="End Date"
                  inputFormat="dd/MM/yyyy"
                  value={tempTopDate?.end}
                  onChange={(newValue) => {
                    setTempTopDate((prev) => ({ ...prev, end: newValue }));
                  }}
                  onAccept={(newValue) => {
                    setTopEndDate(newValue);
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
          </Grid>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} md={2.4}>
            <YearlyWidgetSummary
              title="Revenue"
              subtitle={getTopCurrentFilterLabel()}
              total={dashboardRevenue?.totalRevenue || 0}
              type="currency"
              icon={'heroicons-solid:currency-dollar'}
              isLoading={loadingDashboardRevenue}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <YearlyWidgetSummary
              title="Expense"
              subtitle={getTopCurrentFilterLabel()}
              total={dashboardRevenue?.expense?.totalExpense || 0}
              type="currency"
              color="warning"
              icon={'heroicons-solid:currency-dollar'}
              isLoading={loadingDashboardRevenue}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <YearlyWidgetSummary
              title="Donation"
              subtitle={getTopCurrentFilterLabel()}
              total={dashboardRevenue?.totalRounding || 0}
              type="currency"
              color="success"
              icon={'heroicons-solid:currency-dollar'}
              isLoading={loadingDashboardRevenue}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <YearlyWidgetSummary
              title="Profit"
              subtitle={getTopCurrentFilterLabel()}
              total={
                dashboardRevenue?.totalRevenue +
                dashboardRevenue?.totalRounding -
                dashboardRevenue?.expense?.totalExpense || 0
              }
              type="currency"
              color="info"
              icon={'heroicons-solid:currency-dollar'}
              isLoading={loadingDashboardRevenue}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <YearlyWidgetSummary
              title="Sales"
              subtitle={getTopCurrentFilterLabel()}
              total={dashboardRevenue?.totalSales || 0}
              type="other"
              color="info"
              icon={'heroicons-solid:trending-up'}
              isLoading={loadingDashboardRevenue}
            />
          </Grid>
          <Grid item xs={12}>
            <SalesOverview title="Daily Sales" />
          </Grid>

          <Grid item xs={12} textAlign="right">
            {/* Filter Preset untuk section BAWAH */}
            <Select
              value={isBottomCustomDateActive ? 'date' : bottomFilterLabel}
              onChange={(e) => {
                if (e.target.value === 'date') {
                  handleBottomCustomDateToggle();
                } else {
                  handleBottomPresetFilterChange(e.target.value);
                }
              }}
              sx={{
                height: '40px',
                mt: 2,
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="date">Custom Date</MenuItem>
            </Select>
          </Grid>

          {/* Custom Date Picker untuk section BAWAH */}
          {isBottomCustomDateActive && (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                <Grid item xs={12} sm="auto">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="Start Date"
                      inputFormat="dd/MM/yyyy"
                      value={tempBottomDate?.start}
                      onChange={(newValue) => {
                        setTempBottomDate((prev) => ({ ...prev, start: newValue }));
                      }}
                      onAccept={(newValue) => {
                        setBottomStartDate(newValue);
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

                <Grid item xs={12} sm="auto">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="End Date"
                      inputFormat="dd/MM/yyyy"
                      value={tempBottomDate?.end}
                      onChange={(newValue) => {
                        setTempBottomDate((prev) => ({ ...prev, end: newValue }));
                      }}
                      onAccept={(newValue) => {
                        setBottomEndDate(newValue);
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
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={6}>
            {loadingMostPaymentUsed ? (
              <Stack height={364} justifyContent="center" alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <BestSeller
                title="Payment Method"
                subheader={getBottomCurrentFilterLabel()}
                data={[
                  {
                    label: mostPaymentUsed?.label?.[1] || '',
                    total: mostPaymentUsed?.value?.[1] || 0,
                    percent: ((mostPaymentUsed?.value?.[1] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: mostPaymentUsed?.label?.[5] || '',
                    total: mostPaymentUsed?.value?.[5] || 0,
                    percent: ((mostPaymentUsed?.value?.[5] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: mostPaymentUsed?.label?.[3] || '',
                    total: mostPaymentUsed?.value?.[3] || 0,
                    percent: ((mostPaymentUsed?.value?.[3] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: mostPaymentUsed?.label?.[0] || '',
                    total: mostPaymentUsed?.value?.[0] || 0,
                    percent: ((mostPaymentUsed?.value?.[0] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: mostPaymentUsed?.label?.[2] || '',
                    total: mostPaymentUsed?.value?.[2] || 0,
                    percent: ((mostPaymentUsed?.value?.[2] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
                    type: 'currency',
                  },
                  {
                    label: mostPaymentUsed?.label?.[4] || '',
                    total: mostPaymentUsed?.value?.[4] || 0,
                    percent: ((mostPaymentUsed?.value?.[4] || 0) / (mostPaymentUsed?.totalRevenue || 1)) * 100 || 0,
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
                subheader={getBottomCurrentFilterLabel()}
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
