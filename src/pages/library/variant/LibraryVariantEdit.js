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
import VariantForm from '../../../sections/@dashboard/library/variant/VariantForm';
import useVariant from './service/useVariant';

// ----------------------------------------------------------------------

export default function LibraryVariantEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { id = '' } = useParams();

  const { getById } = useVariant();
  const { data: variantById, isLoading: loadingVariantById } = getById(id);

  return (
    <Page title="Variant: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Variant"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Variant', href: PATH_DASHBOARD.library.variant },
            { name: 'Edit' },
          ]}
        />

        {loadingVariantById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <VariantForm isEdit={isEdit} currentData={variantById} />
        )}
      </Container>
    </Page>
  );
}
