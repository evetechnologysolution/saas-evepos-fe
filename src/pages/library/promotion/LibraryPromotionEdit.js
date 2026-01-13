import React, { useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
// context
import { mainContext } from '../../../contexts/MainContext';

export default function LibraryPromotionEdit() {

  const ctx = useContext(mainContext);

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes('edit');

  const { id = '' } = useParams();

  useEffect(() => {
    ctx.getDetailPromo(id);
  }, [])


  const currentData = ctx.detailPromo ? ctx.detailPromo : null;

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

        <PromotionForm isEdit={isEdit} currentData={currentData} />
      </Container>
    </Page>
  );
}
