import React, { useState } from 'react';
// @mui
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import OfferCard from './OfferCard';

// ----------------------------------------------------------------------

const dummyData = [
    {
        subscription: 'Basic',
        features: [
            'Dashboard',
            'Cashier POS',
            'Single Outlet',
            'Sales Report',
            'Marketing Promotion',
            'Table Setting',
            'Split Bill',
            'Cancel Order',
        ],
        priceMonthly: 130000,
        priceYearly: 1000000,
        isAvailable: true
    },
    {
        subscription: 'Advanced',
        features: [
            'All Features in Basic',
            'Generate QR Code for Self-Order',
            'Self-Order (Mobile View)',
            'Reservation',
            'Delivery Online',
            'Multi Outlet (Max 3)',
        ],
        priceMonthly: 160000,
        priceYearly: 1500000,
        isAvailable: false
    },
    {
        subscription: 'Professional',
        features: [
            'All Features in Advanced',
            'Advanced Financial Report',
            'Multi Outlet (Max 8)',
        ],
        priceMonthly: 200000,
        priceYearly: 1900000,
        isAvailable: false
    },
]

export default function SubscriptionOffer() {
    const theme = useTheme();
    const [payMonthly, setPayMonthly] = useState(true);

    return (
        <>
            <Stack flexDirection="row" justifyContent="flex-end" sx={{ margin: '0 5vw' }}>
                <Button
                    sx={{
                        borderRadius: '16px 0 0 0',
                        // border: `${payMonthly ? `1px solid ${theme.palette.primary.main}` : 'none'}`,
                        // borderBottomColor: 'white',
                        boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
                        overflow: 'hidden'
                    }}
                    variant={payMonthly ? 'contained' : 'text'}
                    onClick={() => setPayMonthly(true)}
                >
                    Pay Monthly
                </Button>
                <Button
                    sx={{
                        borderRadius: '0 16px 0 0',
                        // border: `${!payMonthly ? `1px solid ${theme.palette.primary.main}` : 'none'}`,
                        // borderBottomColor: 'white',
                        boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
                        overflow: 'hidden'
                    }}
                    variant={!payMonthly ? 'contained' : 'text'}
                    onClick={() => setPayMonthly(false)}
                >
                    Pay Yearly
                </Button>
            </Stack>
            <Card
                sx={{
                    margin: '0 5vw',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: '16px 0 16px 16px', boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)'
                }}
            >
                <Box sx={{ p: 5 }} >
                    <Typography variant="h6">Subscription Offer</Typography>
                    <br />
                    <Grid container spacing={5}>
                        {dummyData.map((item, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <OfferCard data={item} isMonthly={payMonthly} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Card>
        </>
    );
}
