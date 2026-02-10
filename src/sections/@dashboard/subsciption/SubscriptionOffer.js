import React, { useState } from 'react';
// @mui
import { Box, Button, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import { useQuery } from 'react-query';
import axios from 'src/utils/axios';
import OfferCard from './OfferCard_new';

// ----------------------------------------------------------------------

export default function SubscriptionOffer() {
  const theme = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ['plan-list'],
    queryFn: async () => {
      const response = await axios.get('/service');
      return response.data;
    },
  });

  const [payMonthly, setPayMonthly] = useState(true);

  return (
    <>
      <Stack flexDirection="row" justifyContent="flex-end">
        <Button
          sx={{
            borderRadius: '16px 0 0 0',
            // border: `${payMonthly ? `1px solid ${theme.palette.primary.main}` : 'none'}`,
            // borderBottomColor: 'white',
            boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
            overflow: 'hidden',
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
            overflow: 'hidden',
          }}
          variant={!payMonthly ? 'contained' : 'text'}
          onClick={() => setPayMonthly(false)}
        >
          Pay Yearly
        </Button>
      </Stack>
      <Card
        sx={{
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px 0 16px 16px',
          boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Box padding={{ xs: 2.5, md: 5 }}>
            <Typography variant="h6">Subscription Offer</Typography>
            <br />
            <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }} alignItems="stretch">
              {data?.docs
                ?.slice()
                ?.sort((a, b) => a.listNumber - b.listNumber)
                ?.map((item, i) => (
                  <Grid
                    item
                    key={item._id || i}
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <OfferCard data={item} isMonthly={payMonthly} isPopular={i === 1} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </Card>
    </>
  );
}
