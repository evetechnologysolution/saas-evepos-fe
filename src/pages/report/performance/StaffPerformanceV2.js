import React, { useState } from 'react';
import { useQuery } from 'react-query';
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
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Label from '../../../components/Label';
// utils
import axios from '../../../utils/axios';
import { formatDate2 } from '../../../utils/getData';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// sections
import { BestActivity, WidgetPerformance } from '../../../sections/@dashboard/app';
import defaultAvatar from '../../../assets/avatar_default.jpg';
import ListActivity from './ListActivity';

// ----------------------------------------------------------------------

export default function StaffPerformance() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const initialData = Array(6).fill({
    label: '',
    total: 0,
    percent: 0,
  });
  const options = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' },
    // { value: "by-date", label: "By Date" }
  ];
  const defaultPeriod = 'this-month';
  const [showFilterDate, setShowFilterDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ctrStaff, setCtrStaff] = useState({
    page: 1,
    perPage: 50,
    search: '',
  });
  const [controller, setController] = useState({
    search: '',
    staff: 'all',
    periodBy: defaultPeriod,
    start: '',
    end: '',
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
      const res = await axios.get(`/user?${queryString}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };
  const { isLoading: loadingStaff, data: staffData } = useQuery(
    [
      'listStaff',
      {
        page: ctrStaff.page,
        perPage: ctrStaff.perPage,
        search: ctrStaff.search,
        // role: 'Content Writer:ne',
      },
    ],
    getStaff
  );

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/progress/v2/log-summary?${queryString}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };

  const { isLoading: loadingSummary, data: summaryData } = useQuery(
    [
      'summaryActivity',
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

  const totalByStatus = summaryData?.detail
    ?.flatMap((d) => d.progress)
    ?.reduce((acc, curr) => {
      const key = curr.status?.toLowerCase();
      if (!acc[key]) {
        acc[key] = { qtyKg: 0, qtyPcs: 0 };
      }
      acc[key].qtyKg += curr.qtyKg || 0;
      acc[key].qtyPcs += curr.qtyPcs || 0;
      return acc;
    }, {});

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h6" mx={1}>
          Staff Performance
        </Typography>

        <Stack sx={{ my: 2 }} gap={4} pb={4}>
          <Typography variant="h6" mx={1} mb={2}>
            Summary
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={1}>
            {loadingStaff ? (
              <Stack width={200} alignItems="center">
                <CircularProgress />
              </Stack>
            ) : (
              <TextField
                name="staff"
                label="Staff"
                placeholder="Staff"
                select
                sx={{ minWidth: 200 }}
                value={controller?.staff || 'all'}
                onChange={(e) => {
                  setController({
                    ...controller,
                    staff: e.target.value,
                  });
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {staffData?.docs?.map((item, i) => (
                  <MenuItem key={i} value={item?._id}>
                    {item?.fullname}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Period"
              name="period"
              select
              sx={{ minWidth: 200 }}
              value={controller?.periodBy || defaultPeriod}
              onChange={(e) => {
                setController({
                  ...controller,
                  periodBy: e.target.value,
                });
              }}
            >
              {options.map((item, i) => (
                <MenuItem key={i} value={item?.value}>
                  {item?.label}
                </MenuItem>
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
            {loadingSummary ? (
              <Grid item xs={12} md={6}>
                <Stack width={300} height={300} alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Stack>
              </Grid>
            ) : (
              controller.staff === 'all' ? (
                summaryData?.detail?.map((item, i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <BestActivity
                      title={item?.staffRef?.fullname || "Activity"}
                      subheader={options.find((opt) => opt.value === controller?.periodBy)?.label || ''}
                      data={item?.progress?.map((item) => {
                        const totalKg = summaryData?.totalKg || 0;
                        const totalPcs = summaryData?.totalPcs || 0;
                        const qtyKg = item?.qtyKg || 0;
                        const qtyPcs = item?.qtyPcs || 0;
                        return {
                          label: item?.status,
                          // qtyOrder: item?.qty || 0,
                          qtyKg,
                          qtyPcs,
                          total: qtyKg + qtyPcs,
                          percent: ((qtyKg + qtyPcs) / (totalKg + totalPcs || 1)) * 100 || 0,
                        };
                      })}
                    />
                  </Grid>
                ))
              ) : (
                <>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ minHeight: 300, height: '100%' }}>
                      <CardContent>
                        <Avatar src={defaultAvatar} alt="avatar" />
                        <Stack gap={2}>
                          <Stack>
                            <Typography variant="body2">Full Name</Typography>
                            <Typography variant="subtitle2">{summaryData?.detail?.[0]?.staffRef?.fullname || '-'}</Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">Role</Typography>
                            <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>{summaryData?.detail?.[0]?.staffRef?.role || '-'}</Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">Created At</Typography>
                            <Typography variant="subtitle2">
                              {summaryData?.detail?.[0]?.staffRef?.createdAt ? formatDate2(summaryData?.detail?.[0]?.staffRef?.createdAt) : '-'}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2">Status</Typography>
                            <div>
                              {summaryData?.detail?.[0]?.staffRef ? (
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={summaryData?.detail?.[0]?.staffRef?.isActive ? 'success' : 'warning'}
                                  sx={{ textTransform: 'capitalize' }}
                                >
                                  {summaryData?.detail?.[0]?.staffRef?.isActive ? 'Active' : 'Inactive'}
                                </Label>
                              ) : (
                                '-'
                              )}
                            </div>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <BestActivity
                      title={summaryData?.detail?.[0]?.staffRef?.fullname || "Activity"}
                      subheader={options.find((opt) => opt.value === controller?.periodBy)?.label || ''}
                      data={summaryData?.detail?.[0]?.progress?.map((item) => {
                        const totalKg = summaryData?.totalKg || 0;
                        const totalPcs = summaryData?.totalPcs || 0;
                        const qtyKg = item?.qtyKg || 0;
                        const qtyPcs = item?.qtyPcs || 0;
                        return {
                          label: item?.status,
                          // qtyOrder: item?.qty || 0,
                          qtyKg,
                          qtyPcs,
                          total: qtyKg + qtyPcs,
                          percent: ((qtyKg + qtyPcs) / (totalKg + totalPcs || 1)) * 100 || 0,
                        };
                      })}
                    />
                  </Grid>
                </>
              )
            )}
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ minHeight: 300, height: '100%' }}>
                {loadingSummary ? (
                  <Stack width={300} height={300} alignItems="center" justifyContent="center">
                    <CircularProgress />
                  </Stack>
                ) : (
                  <>
                    <CardHeader title="Top Performance" />
                    <CardContent>
                      <Stack gap={2}>
                        <Grid container spacing={2}>
                          {summaryData?.topPerformance?.map((item, i) => {
                            const key = item?.status?.toLowerCase();

                            const totalKg = totalByStatus?.[key]?.qtyKg || 0;
                            const totalPcs = totalByStatus?.[key]?.qtyPcs || 0;

                            const qtyKg = item?.qtyKg || 0;
                            const qtyPcs = item?.qtyPcs || 0;

                            const total = totalKg + totalPcs;

                            return (
                              <Grid item xs={12} md={6} xl={4} key={i}>
                                <WidgetPerformance
                                  title={item?.staffRef?.fullname || "-"}
                                  subtitle={item?.status}
                                  qtyKg={qtyKg}
                                  qtyPcs={qtyPcs}
                                  total={qtyKg + qtyPcs}
                                  percent={total ? ((qtyKg + qtyPcs) / total) * 100 : 0}
                                  color="warning"
                                  icon="material-symbols:star-rounded"
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Stack>
                    </CardContent>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Stack>

        <ListActivity />
      </Container>
    </Page >
  );
}
