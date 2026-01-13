import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fNumber, fShortenNumber, fPercent, fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

WidgetSummary.propTypes = {
    chartColor: PropTypes.string,
    chartData: PropTypes.arrayOf(PropTypes.number),
    percent: PropTypes.number,
    title: PropTypes.string,
    caption: PropTypes.string,
    type: PropTypes.string,
    total: PropTypes.number,
    sx: PropTypes.object,
};

export default function WidgetSummary({ title, caption, percent, total, type, chartColor, chartData, sx, ...other }) {
    const theme = useTheme();

    const isDesktop = useResponsive('up', 'lg');

    const chartOptions = {
        colors: [chartColor],
        chart: { sparkline: { enabled: true } },
        plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
        tooltip: {
            enabled: false,
            x: { show: false },
            y: {
                formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: (seriesName) => `@${seriesName}`,
                },
            },
            marker: { show: false },
        },
    };

    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>{title}</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                    <IconWrapperStyle
                        sx={{
                            ...(percent < 0 && {
                                color: 'error.main',
                                bgcolor: alpha(theme.palette.error.main, 0.16),
                            }),
                        }}
                    >
                        <Iconify width={16} height={16} icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
                    </IconWrapperStyle>
                    <Typography component="span" variant="subtitle2">
                        {percent > 0 && '+'}
                        {fPercent(percent)}
                    </Typography>
                    <Typography variant="body2" component="span" noWrap sx={{ color: 'text.secondary' }}>
                        &nbsp;{caption}
                    </Typography>
                </Stack>
                <Typography variant={isDesktop ? "h4" : "h5" } gutterBottom>
                    {type === 'currency' ? fCurrency(total) : fShortenNumber(total)}
                </Typography>
            </Box>
            <ReactApexChart type="bar" series={[{ data: chartData }]} options={chartOptions} width={60} height={36} />
        </Card>
    );
}
