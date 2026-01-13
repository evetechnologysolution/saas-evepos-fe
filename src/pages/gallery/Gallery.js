// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import { GalleryForm } from 'src/sections/@dashboard/library/gallery';

// ----------------------------------------------------------------------

export default function GalleryCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Gallery New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Gallery"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Product', href: PATH_DASHBOARD.library.product },
            { name: 'New' },
          ]}
        />
        <GalleryForm />
      </Container>
    </Page>
  );
}
