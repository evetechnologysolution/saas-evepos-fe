import { useParams } from 'react-router-dom';
// @mui
import { Container, Card, CircularProgress, Stack, Typography, Divider } from '@mui/material';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// utils
import { formatDate, formatDate2, numberWithCommas } from '../../utils/getData';
import useService from './service/useService';

// ----------------------------------------------------------------------

const shadow = '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)';

export default function Success() {
  const { id = '' } = useParams();
  const { successById } = useService();
  const { data, isLoading } = successById(id);

  return (
    <Page title="Subscription: Success" sx={{ height: 1 }}>
      <Container
        maxWidth="sm"
        sx={{
          height: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 4,
            boxShadow: shadow,
          }}
        >
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack alignItems="center" spacing={1}>
                <Iconify icon="icon-park-solid:success" width={160} height={160} color="green" />
                <Typography variant="h6">Transaksi Berhasil</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatDate2(data?.payment?.paidAt)}
                </Typography>
              </Stack>

              <Stack alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2">Total Transaksi</Typography>
                <Typography variant="h5" color="primary">
                  Rp. {numberWithCommas(data?.billedAmount)}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Subscription Plan</Typography>
                <Typography variant="subtitle1">{data?.serviceName}</Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Langganan</Typography>
                <Typography variant="subtitle1">
                  {numberWithCommas(data?.qty)} {data?.subsType === 'monthly' ? 'Bulan' : 'Tahun'}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Durasi</Typography>
                <Typography variant="subtitle1">
                  {formatDate(data?.startDate)} - {formatDate(data?.endDate)}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Card>
      </Container>
    </Page>
  );
}
