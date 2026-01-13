import { useState, useEffect } from 'react';
// @mui
import {
    Container,
    Card,
    Stack,
    Typography,
    Grid,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from '../../utils/axios';
// components
import MyPDF from './PDFCashFlow';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
// utils
import { numberWithCommas, formatDate } from "../../utils/getData";
import { fDecimal } from "../../utils/formatNumber";

// ----------------------------------------------------------------------

export default function CashFlow() {
    const theme = useTheme();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterLoading, setFilterLoading] = useState(false);
    const [data, setData] = useState({});
    const [expense, setExpense] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalCashIn, setTotalCashIn] = useState(0);
    const [totalCashOut, setTotalCashOut] = useState(0);
    const [totalCashFlow, setTotalCashFlow] = useState(0);
    const [total, setTotal] = useState(0);
    const [period, setPeriod] = useState("-");

    useEffect(() => {
        const tCashIn = data?.cashIn || 0;
        const tCashOut = (data?.cashOt || 0) + (data?.refund || 0) + (data?.totalExpense || 0);
        const tSales = data?.sales || 0;
        const tCashFlow = tSales - tCashOut;
        const tAmount = tCashIn + tCashFlow;

        setTotalCashIn(tCashIn);
        setTotalSales(tSales);
        setTotalCashOut(tCashOut);
        setTotalCashFlow(tCashFlow);
        setTotal(tAmount);

        setPeriod(startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "-");
    }, [data]);


    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setData({});
        setPeriod("-");
        setFilterLoading(false);
    };

    const handleFilter = async () => {
        setFilterLoading(true);

        try {
            const [cashFlowResponse, expenseTotalResponse] = await Promise.all([
                axios.get(`/cash-balance/cash-flow?start=${startDate}&end=${endDate}`),
                axios.get(`/expense/total?start=${startDate}&end=${endDate}`)
            ]);
            setFilterLoading(false);
            setData({
                ...cashFlowResponse.data,
                ...expenseTotalResponse.data
            });
        } catch (error) {
            console.error(error);
            setFilterLoading(false);
        }
    };


    return (
        <Page title="Cash Flow" sx={{ height: 1 }}>
            <Container maxWidth="xl">
                <HeaderBreadcrumbs
                    heading="Cash Flow"
                    links={[]}
                />

                <Card
                    sx={{
                        padding: '2vw',
                        boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)'
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
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

                        <Grid item xs={12} sm={6} md={3}>
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

                        <Grid item xs="auto" md={6}>
                            <Stack flexDirection={{ sm: "row" }} justifyContent="space-between" gap={1}>
                                <Stack flexDirection="row" gap={1}>
                                    <LoadingButton variant="contained" title="Search" loading={filterLoading} onClick={() => handleFilter()}>
                                        <Iconify icon={'eva:search-fill'} sx={{ width: 25, height: 25 }} />
                                    </LoadingButton>
                                    <Button variant="contained" color="warning" sx={{ color: "white" }} title="Reset" onClick={() => handleReset()}>
                                        <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
                                    </Button>
                                </Stack>
                                <Stack flexDirection="row">
                                    {period !== '-' ? (
                                        <PDFDownloadLink document={<MyPDF period={period} data={data} />} fileName={`Arus Kas ${period}.pdf`}>
                                            {({ loading }) => (
                                                <Button variant="contained" color="info" title="Export" sx={{ minWidth: 130 }} >
                                                    <Iconify icon={'material-symbols:download-rounded'} sx={{ width: 25, height: 25, mr: 0.5 }} />{loading ? 'Loading...' : 'Download'}
                                                </Button>
                                            )}
                                        </PDFDownloadLink>

                                    ) : (
                                        <Button variant="contained" color="info" title="Export" sx={{ minWidth: 130 }} disabled>
                                            <Iconify icon={'material-symbols:download-rounded'} sx={{ width: 25, height: 25, mr: 0.5 }} />Download
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" color={theme.palette.primary.main}>Periode: {period}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor="#F4F6F8" borderRadius={1} p={2}>
                                <Typography variant="subtitle1" color="#637381">Keterangan</Typography>
                                <Typography variant="subtitle1" color="#637381">Jumlah</Typography>
                            </Stack>

                            {/* Jumalah Awal */}
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`A. Jumlah Awal`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(totalCashIn))}</Typography>
                            </Stack>

                            {/* Total Pendapatan */}
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`B. Total Pendapatan`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(totalSales))}</Typography>
                            </Stack>

                            {/* Total Pengeluaran */}
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`C. Total Pengeluaran`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(totalCashOut))}</Typography>
                            </Stack>

                            {/* Arus Kas */}
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`D. Arus Kas (B-C)`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(totalCashFlow))}</Typography>
                            </Stack>

                            {/* Jumlah Akhir */}
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3} borderRadius={1} bgcolor={theme.palette.primary.lighter}>
                                <Typography variant="subtitle2" color="#637381">{`E. Jumlah Akhir (A+D)`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(total))}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    );
}
