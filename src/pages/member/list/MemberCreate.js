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
import MemberForm from '../../../sections/@dashboard/member/MemberForm';

// ----------------------------------------------------------------------

export default function MemberCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Member: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Member'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'member', href: PATH_DASHBOARD.member.list },
                        { name: 'New' },
                    ]}
                />

                <MemberForm />
            </Container>
        </Page>
    );
}
