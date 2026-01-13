import React from 'react';
// @mui
import { Container } from '@mui/material';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// sections
import PromotionForm from '../../../sections/@dashboard/library/promotion/PromotionForm';

export default function LibraryPromotionCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Promotion: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Promotion"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Promotion', href: PATH_DASHBOARD.library.promotion },
            { name: 'New' },
          ]}
        />

        <PromotionForm />
      </Container>
    </Page>
  );
}
