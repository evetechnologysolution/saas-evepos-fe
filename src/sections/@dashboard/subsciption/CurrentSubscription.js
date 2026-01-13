import PropTypes from 'prop-types';
// @mui
import {
    Alert,
    Box,
    Button,
    Card,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import Avatar from '../../../components/Avatar';

// ----------------------------------------------------------------------

CurrentSubscription.propTypes = {
    handleClick: PropTypes.func,
};

export default function CurrentSubscription({ handleClick }) {
    const theme = useTheme();

    return (
        <Card sx={{ margin: '0 5vw', boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)' }}>
            <Box sx={{ p: 5 }} >
                <Typography variant="h6">Current Subscription</Typography>
                <Stack
                    sx={{
                        my: 2,
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: { xs: 'left', md: 'space-between' },
                        alignItems: { xs: 'left', md: 'center' }
                    }}
                >
                    <Stack flexDirection="row" alignItems="center">
                        <Avatar
                            alt="Store Icon"
                            src='/assets/store.svg'
                            sx={{
                                width: 100,
                                height: 100,
                                backgroundColor: theme.palette.primary.lighter,
                                p: 1,
                                mb: 2,
                                mr: 3
                            }}
                        />
                        <Stack>
                            <Typography variant="subtitle1" mb={1}>Basic</Typography>
                            <Typography variant="body2">Active until 12, June 2023</Typography>
                        </Stack>
                    </Stack>
                    <Button variant="contained" onClick={() => handleClick()}>Upgrade Now</Button>
                </Stack>
                <Stack
                    sx={{
                        px: { xs: 0, md: 10 }
                    }}
                >
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="subtitle1">Your free subscription will end on July 13, 2023. Upgrade your plan to accumulate the subscription period.</Typography>
                    </Alert>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    p: 5,
                                    boxShadow: 0,
                                    color: (theme) => theme.palette.primary.darker,
                                    bgcolor: (theme) => theme.palette.primary.lighter,
                                    minHeight: 250
                                }}
                            >
                                <Typography variant="h6">
                                    Features
                                </Typography>
                                <Stack>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            justifyContent: { xs: 'left', md: 'space-between' },
                                        }}
                                    >
                                        <ul style={{ marginLeft: 30 }}>
                                            <li><Typography variant="subtitle1">Dashboard</Typography></li>
                                            <li><Typography variant="subtitle1">Cashier POS</Typography></li>
                                            <li><Typography variant="subtitle1">Single Outlet</Typography></li>
                                            <li><Typography variant="subtitle1">Sales Report</Typography></li>
                                        </ul>
                                        <ul style={{ marginLeft: 30 }}>
                                            <li><Typography variant="subtitle1">Marketing Promotion</Typography></li>
                                            <li><Typography variant="subtitle1">Table Setting</Typography></li>
                                            <li><Typography variant="subtitle1">Split Bill</Typography></li>
                                            <li><Typography variant="subtitle1">Cancel Order</Typography></li>
                                        </ul>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    p: 5,
                                    boxShadow: 0,
                                    color: (theme) => theme.palette.primary.darker,
                                    bgcolor: (theme) => theme.palette.primary.lighter,
                                    minHeight: 250,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Avatar
                                    alt="Outlet Icon"
                                    src='/assets/outlet.svg'
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        backgroundColor: theme.palette.primary.main,
                                        p: 1,
                                        mb: 2,
                                        position: 'absolute',
                                        top: 30,
                                        left: 30,
                                    }}
                                />
                                <Typography variant="h4" textAlign="center">
                                    Outlet
                                </Typography>
                                <Typography variant="h1" textAlign="center">
                                    1
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </Card>
    );
}
