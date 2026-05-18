import { useParams } from 'react-router-dom';
// @mui
import { Box, Container, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import OrdersForm from '../../sections/@dashboard/cashier/delivery/OrdersForm';
import useDelivery from './service/useDelivery';

// ----------------------------------------------------------------------

export default function CashierDeliveryEdit() {
  const { themeStretch } = useSettings();
  const { getById } = useDelivery();

  const { id = '' } = useParams();

  const { data: currentData, isLoading } = getById(id);

  return (
    <Page title="Delivery: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Delivery"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cashier', href: PATH_DASHBOARD.cashier.root },
            { name: 'Delivery', href: PATH_DASHBOARD.cashier.delivery },
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
