import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// sections
import PromotionForm from '../../../sections/@dashboard/library/promotion/PromotionForm';
// context
import usePromotion from './service/usePromotion';

export default function LibraryPromotionEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { id = '' } = useParams();
  const { getById } = usePromotion();

  const { data: promoById, isLoading: loadingPromoById } = getById(id);

  return (
    <Page title="Promotion: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Promotion"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Promotion', href: PATH_DASHBOARD.library.promotion },
            { name: 'Edit' },
          ]}
        />

        {loadingPromoById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <PromotionForm isEdit={isEdit} currentData={promoById} />
        )}
      </Container>
    </Page>
  );
}
