// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserForm from '../../sections/@dashboard/user/UserForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="User: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New User'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'User', href: PATH_DASHBOARD.user.root },
                        { name: 'New' },
                    ]}
                />

                <UserForm />
            </Container>
        </Page>
    );
}
