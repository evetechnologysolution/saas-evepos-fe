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
import { BusinessProfile } from './sections';

// ----------------------------------------------------------------------

export default function ProfileBusiness() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Profile: Business Information">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Business Information"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Business Information' }]}
        />

        <Box sx={{ mb: 5 }} />
        <Box>
          <BusinessProfile />
        </Box>
      </Container>
    </Page>
  );
}
