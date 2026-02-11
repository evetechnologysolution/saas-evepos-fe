/* eslint-disable import/no-unresolved */
// @mui
import { Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { AccountProfile } from './sections';

// ----------------------------------------------------------------------

export default function ProfileAccount() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Profile: Account Information">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account Information"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Account Information' }]}
        />

        <Box sx={{ mb: 5 }} />
        <Box>
          <AccountProfile />
        </Box>
      </Container>
    </Page>
  );
}
