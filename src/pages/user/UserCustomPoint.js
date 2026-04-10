import { useParams } from 'react-router-dom';
// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserForm from '../../sections/@dashboard/user/UserFormCustomPoint';
import useUser from './service/useUser';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { id = '' } = useParams();
  const { getById } = useUser();
  const { data: userById, isLoading: loadingUserById } = getById(id);

  return (
    <Page title="User: Custom Point">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="User Custom Point"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Custom Point' },
          ]}
        />

        {loadingUserById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <UserForm currentData={userById} />
        )}
      </Container>
    </Page>
  );
}
