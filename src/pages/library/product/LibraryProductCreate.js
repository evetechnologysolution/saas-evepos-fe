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
import ProductForm from '../../../sections/@dashboard/library/product/ProductForm';

// ----------------------------------------------------------------------

export default function LibraryProductCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Product: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Product', href: PATH_DASHBOARD.library.product },
            { name: 'New' },
          ]}
        />

        <ProductForm />
      </Container>
    </Page>
  );
}
