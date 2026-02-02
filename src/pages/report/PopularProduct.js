import React, { useState } from 'react';
import { useQuery } from 'react-query';
// @mui
import { Button, Container, Grid, Stack, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
// sections
import { BestSeller } from '../../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function PopularProduct() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [filterLabel, setFilterLabel] = useState('This Year');

  const [showFilterDate, setShowFilterDate] = useState(false);
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const options = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'This Year', value: 'thisYear' },
    { label: 'By Date', value: 'by-date' },
  ];

  const defaultFilter = 'thisYear';
  const [controller, setController] = useState({
    filter: defaultFilter,
    start: '',
    end: '',
    limit: 10,
  });

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey;
    const queryString = new URLSearchParams(params).toString();
    try {
      const res = await axios.get(`/popular/category?${queryString}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch popular products');
    }
  };

  const { isLoading, data } = useQuery(
    [
      'listPopularCategory',
      {
        filter: controller.filter,
        start: controller.start,
        end: controller.end,
        limit: controller.limit,
      },
    ],
    getData
  );

  const handleReset = () => {
    setPeriod('');
    setStartDate(null);
    setEndDate(null);
    setFilterLabel('This Year');
    setController({
      filter: defaultFilter,
      start: '',
      end: '',
      limit: 10,
    });
    setShowFilterDate(false);
  };

  const handleFilter = (val) => {
    setFilterLabel(val?.label);
    if (val?.value !== 'by-date') {
      setController({
        ...controller,
        filter: val?.value,
        start: '',
        end: '',
      });
      setShowFilterDate(false);
      setPeriod('');
    } else {
      setShowFilterDate(true);
    }
  };

  const handleSearch = async () => {
    const formattedStart = moment(startDate).format('YYYY-MM-DD');
    const formattedEnd = moment(endDate).format('YYYY-MM-DD');

    setController({
      ...controller,
      filter: '',
      start: formattedStart,
      end: formattedEnd,
    });
    setPeriod(`(${moment(startDate).format('DD MMMM YYYY')} - ${moment(endDate).format('DD MMMM YYYY')})`);
  };

  // Helper function to get category data
  const getCategoryData = (categoryName) => {
    const category = data?.categories?.find((cat) => cat.category.toLowerCase() === categoryName.toLowerCase());
    return category || { detail: [], totalSales: 0 };
  };

  // Helper function to format product data for BestSeller component
  const formatProductData = (categoryName) => {
    const categoryData = getCategoryData(categoryName);
    const products = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 10; i++) {
      const detail = categoryData.detail?.[i];
      products.push({
        label: detail?.product || '',
        total: detail?.sales || 0,
        percent: categoryData.totalSales > 0 ? ((detail?.sales || 0) / categoryData.totalSales) * 100 : 0,
      });
    }

    return products;
  };

  return (
    <Page title="Popular Product">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h6" mx={1}>
          Popular Product by Category
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
                bgcolor: filterLabel === item?.label ? theme.palette.primary.lighter : '',
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
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{ color: 'white', mr: 1 }}
                    title="Reset"
                    onClick={() => handleReset()}
                  >
                    <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
                  </Button>
                  <LoadingButton
                    variant="contained"
                    title="Search"
                    disabled={startDate && endDate ? Boolean(false) : Boolean(true)}
                    loading={isLoading}
                    onClick={() => handleSearch()}
                  >
                    <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Render BestSeller components for each category */}
          {data?.categories?.map((category, index) => (
            <Grid item xs={12} md={6} lg={6} key={index}>
              <BestSeller
                sx={{
                  padding: '1vw',
                  boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
                }}
                title={`Top 10 ${category.category.charAt(0).toUpperCase() + category.category.slice(1)}`}
                subheader={`${data?.filter || filterLabel} ${period}`}
                data={formatProductData(category.category)}
              />
            </Grid>
          ))}

          {isLoading && (
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Grid>
          )}
          {/* Show message if no data */}
          {!isLoading && (!data?.categories || data?.categories?.length === 0) && (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                No data available for the selected period
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
