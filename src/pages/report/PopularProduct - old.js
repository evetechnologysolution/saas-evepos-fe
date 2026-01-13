import React, { useEffect, useContext, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  YearlyWidgetSummary,
  SalesOverview,
  RevenueOverview,
  BestSeller,
  TableComponent,
} from '../../sections/@dashboard/app';
// context
import { dashboardContext } from '../../contexts/DashboardContext';

// ----------------------------------------------------------------------

export default function PopularProduct() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const ctx = useContext(dashboardContext);

  const [filterLabel, setFilterLabel] = useState('This Month');
  const [popular, setPopular] = useState(null);
  const [popularDrink, setPopularDrink] = useState(null);

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (filterLabel === 'Today') {
      setPopular(ctx.popularToday);
      setPopularDrink(ctx.popularDrinkToday);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === 'This Week') {
      setPopular(ctx.popularThisWeek);
      setPopularDrink(ctx.popularDrinkThisWeek);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === 'This Month') {
      setPopular(ctx.popularThisMonth);
      setPopularDrink(ctx.popularDrinkThisMonth);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === 'This Year') {
      setPopular(ctx.popularThisYear);
      setPopularDrink(ctx.popularDrinkThisYear);
      setShowFilterDate(false);
      handleReset();
    } else if (filterLabel === 'By Date') {
      setShowFilterDate(true);
      if (startDate && endDate) {
        const getData = async () => {
          try {
            await axios.get(`/report/popular/date?filter=food&start=${startDate}&end=${endDate}`).then((response) => {
              setPopular(response.data[0]);
            });
            await axios.get(`/report/popular/date?filter=drink&start=${startDate}&end=${endDate}`).then((response) => {
              setPopularDrink(response.data[0]);
            });
          } catch (error) {
            console.log(error);
            setPopular([]);
            setPopularDrink([]);
          }
        };
        getData();
      }
    }
  }, [filterLabel]);

  const handleSearch = async () => {
    try {
      if (startDate && endDate) {
        const popularFood = await axios.get(`/report/popular/date?filter=food&start=${startDate}&end=${endDate}`);
        const popularDrink = await axios.get(`/report/popular/date?filter=drink&start=${startDate}&end=${endDate}`);

        setPeriod(`(${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')})`);
        setPopular(popularFood.data[0]);
        setPopularDrink(popularDrink.data[0]);
      }
    } catch (error) {
      console.log(error);
      setPopular([]);
      setPopularDrink([]);
    }
  };

  const handleReset = () => {
    setPeriod("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    ctx.getPopularToday();
    ctx.getPopularThisWeek();
    ctx.getPopularThisMonth();
    ctx.getPopularThisYear();
  }, []);

  return (
    <Page title="Popular Product">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Popular Product"
          links={[]}
          action={
            <>
              <Select
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
                sx={{
                  height: '40px',
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
                    <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
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
            <BestSeller
              sx={{
                padding: '1vw',
                boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)'
              }}
              title="Food"
              subheader={`${filterLabel} ${period}`}
              data={[
                {
                  label: popular?.detail?.[0]?.product || '',
                  total: popular?.detail?.[0]?.sales || 0,
                  percent:
                    ((popular?.detail?.[0]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[1]?.product || '',
                  total: popular?.detail?.[1]?.sales || 0,
                  percent:
                    ((popular?.detail?.[1]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[2]?.product || '',
                  total: popular?.detail?.[2]?.sales || 0,
                  percent:
                    ((popular?.detail?.[2]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[3]?.product || '',
                  total: popular?.detail?.[3]?.sales || 0,
                  percent:
                    ((popular?.detail?.[3]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[4]?.product || '',
                  total: popular?.detail?.[4]?.sales || 0,
                  percent:
                    ((popular?.detail?.[4]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[5]?.product || '',
                  total: popular?.detail?.[5]?.sales || 0,
                  percent:
                    ((popular?.detail?.[5]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[6]?.product || '',
                  total: popular?.detail?.[6]?.sales || 0,
                  percent:
                    ((popular?.detail?.[6]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[7]?.product || '',
                  total: popular?.detail?.[7]?.sales || 0,
                  percent:
                    ((popular?.detail?.[7]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[8]?.product || '',
                  total: popular?.detail?.[8]?.sales || 0,
                  percent:
                    ((popular?.detail?.[8]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popular?.detail?.[9]?.product || '',
                  total: popular?.detail?.[9]?.sales || 0,
                  percent:
                    ((popular?.detail?.[9]?.sales || 0) / (popular?.totalSales || 0)) * 100 || 0,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <BestSeller
              sx={{
                padding: '1vw',
                boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)'
              }}
              title="Beverages"
              subheader={`${filterLabel} ${period}`}
              data={[
                {
                  label: popularDrink?.detail?.[0]?.product || '',
                  total: popularDrink?.detail?.[0]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[0]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[1]?.product || '',
                  total: popularDrink?.detail?.[1]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[1]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[2]?.product || '',
                  total: popularDrink?.detail?.[2]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[2]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[3]?.product || '',
                  total: popularDrink?.detail?.[3]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[3]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[4]?.product || '',
                  total: popularDrink?.detail?.[4]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[4]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[5]?.product || '',
                  total: popularDrink?.detail?.[5]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[5]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[6]?.product || '',
                  total: popularDrink?.detail?.[6]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[6]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[7]?.product || '',
                  total: popularDrink?.detail?.[7]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[7]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[8]?.product || '',
                  total: popularDrink?.detail?.[8]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[8]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
                {
                  label: popularDrink?.detail?.[9]?.product || '',
                  total: popularDrink?.detail?.[9]?.sales || 0,
                  percent:
                    ((popularDrink?.detail?.[9]?.sales || 0) / (popularDrink?.totalSales || 0)) * 100 || 0,
                },
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
