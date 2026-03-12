import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import BankForm from './sections/BankForm';
import useService from './service/useService';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { id = '' } = useParams();
  const { getById } = useService();
  const { data: dataById, isLoading } = getById(id);

  return (
    <Page title="Bank Information: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Bank"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bank', href: PATH_DASHBOARD.profile.bank },
            { name: 'Edit' },
          ]}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <BankForm isEdit={isEdit} currentData={dataById} />
        )}
      </Container>
    </Page>
  );
}
