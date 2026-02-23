import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Form from './form';
import useTicket from './service/useTicket';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { id = '' } = useParams();
  const { getById } = useTicket();
  const { data: userById, isLoading: loadingUserById } = getById(id);

  return (
    <Page title="Ticket: Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Detail Ticket"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Edit' },
          ]}
        />

        {loadingUserById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Form isEdit={isEdit} type="view" currentData={userById} />
        )}
      </Container>
    </Page>
  );
}
