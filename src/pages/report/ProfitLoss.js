import { useState, useEffect } from 'react';
// @mui
import {
    Container,
    Card,
    Stack,
    Typography,
    Grid,
    Button,
    Divider,
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
import MyPDF from './PDFProfitLoss';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
// utils
import { numberWithCommas, formatDate } from "../../utils/getData";
import { fDecimal } from "../../utils/formatNumber";

// ----------------------------------------------------------------------

export default function ProfitLoss() {
    const theme = useTheme();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterLoading, setFilterLoading] = useState(false);
    const [data, setData] = useState({});
    const [totalSales, setTotalSales] = useState(0);
    const [gorssProfit, setGorssProfit] = useState(0);
    const [otherCost, setOtherCost] = useState(0);
    const [operationalProfit, setOperationalProfit] = useState(0);
    const [otherIncome, setOtherIncome] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [period, setPeriod] = useState("-");

    useEffect(() => {
        const tSales = (data?.sales || 0) - (data?.discount || 0) - (data?.refund || 0);
        const tGross = tSales - (data?.productionCost || 0);
        const tOtherCost = (data?.tax || 0) + (data?.expenses?.code1 || 0) + (data?.expenses?.code2 || 0)
            + (data?.expenses?.code3 || 0) + (data?.expenses?.code4 || 0) + (data?.expenses?.code5 || 0)
            + (data?.expenses?.code6 || 0) + (data?.expenses?.code7 || 0) + (data?.expenses?.code8 || 0);
        const tOperational = tGross - tOtherCost;
        const tOtherIncome = (data?.serviceCharge || 0) + (data?.deliveryPrice || 0);
        const tNet = tOperational + tOtherIncome;

        setTotalSales(tSales);
        setGorssProfit(tGross);
        setOtherCost(tOtherCost);
        setOperationalProfit(tOperational);
        setOtherIncome(tOtherIncome);
        setNetProfit(tNet);

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

        await axios.get(`/report/profit?start=${startDate}&end=${endDate}`).then((res) => {
            setTimeout(() => {
                setFilterLoading(false);
                setData(res.data);
            }, 500);
        }).catch((e) => {
            console.log(e);
            setFilterLoading(false);
        });
    };

    return (
        <Page title="Profit Loss" sx={{ height: 1 }}>
            <Container maxWidth="xl">
                <HeaderBreadcrumbs
                    heading="Profit Loss"
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
                                        <PDFDownloadLink document={<MyPDF period={period} data={data} />} fileName={`Laba Rugi ${period}.pdf`}>
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

                            {/* Pendapatan */}
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Pendapatan</Typography>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Penjualan</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.sales || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Diskon Penjualan</Typography>
                                    <Typography variant="body2" color="#637381">(Rp. {numberWithCommas(fDecimal(data?.discount || 0))})</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">{`Pengembalian Dana (Refund)`}</Typography>
                                    <Typography variant="body2" color="#637381">(Rp. {numberWithCommas(fDecimal(data?.refund || 0))})</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Total Pendapatan</Typography>
                                    <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(totalSales))}</Typography>
                                </Stack>
                            </Stack>

                            {/* Biaya Produksi */}
                            <Divider />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Biaya Produksi</Typography>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Total Biaya Produksi</Typography>
                                    <Typography variant="subtitle2" color="#637381">(Rp. {numberWithCommas(fDecimal(data?.productionCost || 0))})</Typography>
                                </Stack>
                            </Stack>

                            {/* Laba Rugi Kotor */}
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor="#F4F6F8" borderRadius={1} p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`A. Laba (Rugi) Kotor`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(gorssProfit))}</Typography>
                            </Stack>

                            {/* Beban */}
                            <Divider sx={{ mx: "10px" }} />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Beban</Typography>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Beban Pajak</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.tax || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Beban Gaji</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code1 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Beban Sewa Gedung</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code2 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Beban Listrik dan Telepon</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code3 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Beban Lain-lain</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code4 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Pembelian</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code5 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Potongan Pembelian</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code6 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Retur Pembelian dan Pengurangan Harga</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code7 || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Pengeluaran Outlet</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.expenses?.code8 || 0))}</Typography>
                                </Stack>
                            </Stack>

                            {/* Total Beban */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`B. Total Beban`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(otherCost))}</Typography>
                            </Stack>

                            {/* Laba Rugi Operasional */}
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor="#F4F6F8" borderRadius={1} p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`C. Laba (Rugi) Operasional (A-B)`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(operationalProfit))}</Typography>
                            </Stack>

                            {/* Pendapatan Lain */}
                            <Divider sx={{ mx: "10px" }} />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Pendapatan Lain-lain</Typography>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Biaya Jasa</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.serviceCharge || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">Biaya Pengiriman</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.deliveryPrice || 0))}</Typography>
                                </Stack>
                            </Stack>

                            {/* Total Pendapatan Lain */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`D. Total Pendapatan Lain-lain`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(otherIncome))}</Typography>
                            </Stack>

                            {/* Laba Rugi Bersih */}
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor={theme.palette.primary.lighter} borderRadius={1} p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">{`E. Laba (Rugi) Bersih (C+D)`}</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(netProfit))}</Typography>
                            </Stack>
                            <Divider sx={{ mx: "10px" }} />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    );
}
