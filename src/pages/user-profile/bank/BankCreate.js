// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import BankForm from './sections/BankForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Bank Information: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Bank"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bank', href: PATH_DASHBOARD.profile.bank },
            { name: 'New' },
          ]}
        />

        <BankForm />
      </Container>
    </Page>
  );
}
