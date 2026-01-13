import PropTypes from 'prop-types';
// @mui
import {
    Box,
    Button,
    Card,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

OfferCard.propTypes = {
    data: PropTypes.object,
    isMonthly: PropTypes.bool,
};

export default function OfferCard({ data, isMonthly }) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                p: 5,
                boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
                ...(!data.isAvailable && { opacity: 0.6, backgroundColor: '#f1f1f1' }),
            }}
        >
            <Stack justifyContent="space-between" gap={3} height={500}>
                <Stack gap={1} mb={1}>
                    <Typography variant="h6" textAlign="center" mb={1}>{data.subscription}</Typography>
                    <Box style={{ margin: 'auto' }}>
                        {data.features.map((item, i) => (
                            <Stack flexDirection="row" alignItems="center" gap={1} mb={1} key={i}>
                                <Stack>
                                    <Iconify icon="ic:round-check-circle" color={theme.palette.primary.main} width={24} height={24} />
                                </Stack>
                                <Typography variant="body2">{item}</Typography>
                            </Stack>
                        ))}
                    </Box>
                </Stack>
                <Stack alignItems="center" gap={2}>
                    <Label variant="ghost" color="success" sx={{ textTransform: 'capitalize' }}>
                        Pay {isMonthly ? 'Monthly' : 'Yearly'}
                    </Label>
                    <Typography variant="h4">{`${fCurrency(isMonthly ? data.priceMonthly : data.priceYearly)}`}</Typography>
                    <Typography variant="body2">Outlets Per {isMonthly ? 'Month' : 'Year'}</Typography>
                    <Button variant="contained" disabled={!data.isAvailable ? Boolean(true) : Boolean(false)}>Buy Now </Button>
                </Stack>
            </Stack>
        </Card>
    );
}
