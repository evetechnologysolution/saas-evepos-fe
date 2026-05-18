import { useParams } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
import { OrdersForm } from 'src/sections/@dashboard/cashier/orders';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import useTransfer from './service/useTransfer';

// ----------------------------------------------------------------------

export default function CashierTransferEdit() {
  const { themeStretch } = useSettings();
  const { getById } = useTransfer();

  const { id = '' } = useParams();

  const { data: currentData, isLoading } = getById(id);

  return (
    <Page title="Orders: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Orders"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cashier', href: PATH_DASHBOARD.cashier.root },
            { name: 'Transfer Orders', href: PATH_DASHBOARD.cashier.transfer },
            { name: 'Edit' },
          ]}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <OrdersForm currentData={currentData} />
        )}
      </Container>
    </Page>
  );
}
