import { useState, useEffect } from 'react';
// @mui
import {
    Container,
    Card,
    Stack,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Button,
    Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from '../../utils/axios';
// components
import MyPDF from './PDFNeraca';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
// utils
import { numberWithCommas, formatDate } from "../../utils/getData";
import { fDecimal } from "../../utils/formatNumber";

// ----------------------------------------------------------------------

export default function Neraca() {
    const theme = useTheme();
    const [filterLoading, setFilterLoading] = useState(false);
    const [data, setData] = useState({});
    const [period, setPeriod] = useState("-");
    const [filterLabel, setFilterLabel] = useState("");
    const [liabilitas, setLiabilitas] = useState(0);
    const [capitalAmount, setCapitalAmount] = useState(0);

    useEffect(() => {
        setLiabilitas(data?.tax || 0);
        setCapitalAmount((data?.prevSales || 0) - (data?.sales || 0));

        setPeriod(data?.start && data?.end ? `${formatDate(data?.start)} - ${formatDate(data?.end)}` : "-");
    }, [data]);


    const handleReset = () => {
        setData({});
        setPeriod("-");
        setFilterLoading(false);
        setFilterLabel("");
    };

    const handleFilter = async () => {
        if (filterLabel) {
            setFilterLoading(true);

            await axios.get(`/report/neraca?filter=${filterLabel}`).then((res) => {
                setTimeout(() => {
                    setFilterLoading(false);
                    setData(res.data);
                }, 500);
            }).catch((e) => {
                console.log(e);
                setFilterLoading(false);
            });
        }
    };

    return (
        <Page title="Neraca" sx={{ height: 1 }}>
            <Container maxWidth="xl">
                <HeaderBreadcrumbs
                    heading="Neraca"
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
                            <FormControl fullWidth>
                                <InputLabel id="filter-label">Filter By</InputLabel>
                                <Select
                                    labelId="filter-label"
                                    name="filter"
                                    label="Filter By"
                                    placeholder="Filter By"
                                    value={filterLabel}
                                    onChange={(e) => setFilterLabel(e.target.value)}
                                >
                                    <MenuItem value="" disabled>Select One</MenuItem>
                                    <Divider />
                                    <MenuItem value="this-week">This Week</MenuItem>
                                    <MenuItem value="this-month">This Month</MenuItem>
                                    <MenuItem value="this-year">This Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs="auto" md={9}>
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
                                        <PDFDownloadLink document={<MyPDF period={period} data={data} />} fileName={`Neraca ${period}.pdf`}>
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
                            {/* Aset */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor="#F4F6F8" borderRadius={1} p={2}>
                                <Typography variant="subtitle2" color="#637381">Aset</Typography>
                            </Stack>
                            <Divider />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ md: 5 }}>
                                    <Typography variant="body2" color="#637381">(1-10001) Kas</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.cashIn || 0))}</Typography>
                                </Stack>
                            </Stack>

                            {/* Total Aset */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Total Aset</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.cashIn || 0))}</Typography>
                            </Stack>

                            {/* Liabilitas dan Modal */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" bgcolor="#F4F6F8" borderRadius={1} p={2}>
                                <Typography variant="subtitle2" color="#637381">Liabilitas dan Modal</Typography>
                            </Stack>

                            <Divider />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ xs: 2, md: 5 }}>
                                    <Typography variant="body2" color="#637381">(2-20500) PPN Keluaran</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.tax || 0))}</Typography>
                                </Stack>
                            </Stack>

                            {/* Total Liabilitas */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" ml={{ xs: 2, md: 5 }} p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Total Liabilitas</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(liabilitas))}</Typography>
                            </Stack>

                            {/* Modal Pemilik */}
                            <Divider />
                            <Stack justifyContent="space-between" p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381" ml={{ xs: 2, md: 5 }}>Modal Pemilik</Typography>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ xs: 2, md: 5 }}>
                                    <Typography variant="body2" color="#637381">Pendapatan Periode Lalu</Typography>
                                    <Typography variant="body2" color="#637381">Rp. {numberWithCommas(fDecimal(data?.prevSales || 0))}</Typography>
                                </Stack>
                                <Stack flexDirection="row" justifyContent="space-between" ml={{ xs: 2, md: 5 }}>
                                    <Typography variant="body2" color="#637381">Pendapatan Periode Ini</Typography>
                                    <Typography variant="body2" color="#637381">(Rp. {numberWithCommas(fDecimal(data?.sales || 0))})</Typography>
                                </Stack>
                            </Stack>

                            {/* Total Modal Pemilik */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" ml={{ xs: 2, md: 5 }} p={2} gap={3}>
                                <Typography variant="subtitle2" color="#637381">Total Modal Pemilik</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(capitalAmount))}</Typography>
                            </Stack>

                            {/* Total Liabilitas dan Modal */}
                            <Divider />
                            <Stack flexDirection="row" justifyContent="space-between" p={2} gap={3} borderRadius={1} bgcolor={theme.palette.primary.lighter}>
                                <Typography variant="subtitle2" color="#637381">Total Liabilitas dan Modal</Typography>
                                <Typography variant="subtitle2" color="#637381">Rp. {numberWithCommas(fDecimal(liabilitas + capitalAmount))}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    );
}
