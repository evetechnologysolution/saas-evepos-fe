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
import BannerForm from '../../../sections/@dashboard/library/banner/BannerForm';

// ----------------------------------------------------------------------

export default function LibraryBannerCreate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Banner: New">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading='New Banner'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Library', href: PATH_DASHBOARD.library.root },
                        { name: 'Banner', href: PATH_DASHBOARD.library.banner },
                        { name: 'New' },
                    ]}
                />

                <BannerForm />
            </Container>
        </Page>
    );
}
