import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import ProductForm from '../../../sections/@dashboard/library/product/ProductForm';
import useProduct from './service/useProduct';

// ----------------------------------------------------------------------

export default function LibraryProductEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { getById } = useProduct();
  const { id = '' } = useParams();

  const { data: productById, isLoading: loadingProductById } = getById(id);

  const isEdit = pathname.includes('edit');

  return (
    <Page title="Product: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Product', href: PATH_DASHBOARD.library.product },
            { name: 'Edit' },
          ]}
        />
        {loadingProductById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductForm isEdit={isEdit} currentData={productById} />
        )}
      </Container>
    </Page>
  );
}
