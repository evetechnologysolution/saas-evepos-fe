// @mui
import { Container } from '@mui/material';
// sections
import SubscriptionCheckout from '../../sections/@dashboard/subsciption/SubscriptionCheckout';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function Checkout() {
  return (
    <Page title="Subscription" sx={{ height: 1 }}>
      <Container maxWidth={false} sx={{ height: 1 }}>
        <HeaderBreadcrumbs
          heading="Subscription"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Subscription',
              href: PATH_DASHBOARD.subscription.root,
            },
            { name: 'checkout' },
          ]}
        />

        <SubscriptionCheckout />
      </Container>
    </Page>
  );
}
